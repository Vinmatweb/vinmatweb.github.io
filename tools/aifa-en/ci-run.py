import base64,json,pathlib,shutil,subprocess,sys
root=pathlib.Path(__file__).resolve().parent
repo=root.parent.parent
request=json.loads((root/'ci-input.json').read_text())
entry=next(e for e in json.loads((root/'en-catalog.json').read_text()) if e['key']==request['key'])
shutil.copyfile(repo/entry['path'],root/'en-input-cs.html')
(root/'en-input-translation.json').write_text(json.dumps(request['translation'],ensure_ascii=False))
for name in ['bestiary-cards-en.js','catalog-cards-en.js']:
 shutil.copyfile(repo/'ai-fantasy-adventure'/'assets'/name,root/name)
subprocess.run([sys.executable,str(root/'build-en-page.py'),request['key']],cwd=root,check=True)
subprocess.run(['node','check-en-page-card.cjs'],cwd=root,check=True)
result={'key':request['key'],'html':(root/'en-output.html').read_text(),'qr':(root/'en-output-qr.txt').read_text().strip()}
encoded=base64.b64encode(json.dumps(result,ensure_ascii=False).encode()).decode()
for i in range(0,len(encoded),10000):
 print('AIFA_EN_RESULT '+encoded[i:i+10000],flush=True)
print('AIFA_EN_COMPLETE',flush=True)
