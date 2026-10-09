"""Audit this small public repository and build an explicit Pages allowlist."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess

ROOT=Path(__file__).resolve().parents[1]
SITE={'site/index.html','site/404.html','site/styles.css','site/app.js','site/model.js','site/catalog.js','site/scene.js','site/favicon.svg','site/vendor/three.module.js','site/vendor/three.core.js','site/vendor/OrbitControls.js','site/vendor/LICENSE.txt'}
ALLOWED=SITE|{'README.md','.gitignore','package.json','vendor-lock.json','scripts/release_check.py','scripts/model.test.mjs','.github/workflows/pages.yml'}
NAMES={'nature-wx-lab','github-actions[bot]'}
EMAIL=re.compile(r'[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}')
SAFE_EMAIL=re.compile(r'(?:[0-9]+\+)?(?:nature-wx-lab|github-actions\[bot\])@users\.noreply\.github\.com')
PRIVATE_PATHS=['/'+'Users/','/'+'home/','file'+':/'+'/','Documents/'+'Codex','Documents/'+'Claude']
CREDENTIAL=re.compile(r'(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[A-Z0-9]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|sk-[A-Za-z0-9_-]{24,})')

def git(*args):return subprocess.check_output(['git',*args],cwd=ROOT)
def fail(message):raise SystemExit('RELEASE_BLOCKED: '+message)
def scan(data,label,vendor=False):
    text=data.decode('utf-8')
    paths=PRIVATE_PATHS if not vendor else PRIVATE_PATHS[:2]+PRIVATE_PATHS[3:]
    if any(s in text for s in paths) or CREDENTIAL.search(text):fail(label+' contains a private-path or credential pattern')
    local_user=os.environ.get('USER','')
    if local_user not in {'','runner','root'} and local_user.casefold() in text.casefold():fail(label+' contains the local account name')
    if not vendor and any(not SAFE_EMAIL.fullmatch(e) for e in EMAIL.findall(text)):fail(label+' contains an unapproved email-like value')

def audit():
    tracked=set(git('ls-files','-z').decode().strip('\0').split('\0'))
    if tracked!=ALLOWED:fail('tracked file allowlist mismatch')
    lock=json.loads((ROOT/'vendor-lock.json').read_text())['sha256']
    for name in sorted(ALLOWED):
        path=ROOT/name
        if path.is_symlink() or not path.is_file():fail(name+' is missing or not a regular file')
        data=path.read_bytes()
        if name in lock and hashlib.sha256(data).hexdigest()!=lock[name]:fail(name+' differs from reviewed vendor bytes')
        scan(data,name,name in lock)
    if (ROOT/'site/index.html').stat().st_size<1000:fail('empty UI')
    html=(ROOT/'site/index.html').read_text()
    for rule in ["connect-src 'none'","script-src 'self'","object-src 'none'","base-uri 'none'","form-action 'none'"]:
        if rule not in html:fail('required browser policy missing')
    for path in ['site/app.js','site/model.js','site/catalog.js','site/scene.js']:
        source=(ROOT/path).read_text()
        if re.search(r'\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon|eval)\s*\(|\.innerHTML\s*=|navigator\.geolocation',source):fail(path+' introduces an unreviewed network or injection surface')
    commits=git('rev-list','--all').decode().splitlines()
    for commit in commits:
        parts=git('show','-s','--format=%an%x00%ae%x00%cn%x00%ce%x00%B',commit).decode().split('\0',4)
        if parts[0] not in NAMES or parts[2] not in NAMES or not SAFE_EMAIL.fullmatch(parts[1]) or not SAFE_EMAIL.fullmatch(parts[3]):fail('commit identity is not allowlisted')
        scan(parts[4].encode(),'commit message')
        entries=git('ls-tree','-r',commit).decode().splitlines()
        for entry in entries:
            meta,name=entry.split('\t');mode,kind,oid=meta.split()
            if name not in ALLOWED or mode!='100644' or kind!='blob':fail('history file allowlist mismatch')
            data=git('cat-file','blob',oid)
            if name in lock and hashlib.sha256(data).hexdigest()!=lock[name]:fail('unreviewed vendor version in history')
            scan(data,'history:'+name,name in lock)
    print(f'RELEASE_CHECK_OK files={len(ALLOWED)} site_files={len(SITE)} commits={len(commits)}')

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--build',action='store_true');parser.add_argument('--publish-request');parser.add_argument('--preview-verified',action='store_true');parser.add_argument('--target');args=parser.parse_args()
    if args.publish_request is not None:
        if not args.preview_verified or args.target!='nature-wx-lab/garden-canvas' or not any(v in args.publish_request for v in ['公開して','公開まで']):fail('publication authority, target or preview missing')
    audit()
    if args.build:
        out=ROOT/'_site';out.mkdir(exist_ok=True)
        if any(out.iterdir()):fail('staging directory must start empty')
        for name in sorted(SITE):
            dest=out/Path(name).relative_to('site');dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/name,dest)
        print('PAGES_ARTIFACT_OK')
if __name__=='__main__':main()
