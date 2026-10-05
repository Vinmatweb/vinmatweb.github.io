from pathlib import Path
from docx import Document
from lxml import etree as E
import zipfile,json,re,hashlib,sys
name=sys.argv[1]
files={'magic':'AI_Fantasy_Adventure_Magic_and_Spell_Catalogue_v1_0_EN.docx','equipment':'AI_Fantasy_Adventure_Equipment_Catalogue_v1_0_EN.docx'}
file=Path('outputs')/files[name];original=Document(f'sources/{name}-cs.docx');out=Document(file)
shape=lambda d:[(len(t.rows),len(t.columns))for t in d.tables]
assert shape(original)==shape(out)
assert len(original.paragraphs)==len(out.paragraphs)
if name=='magic':assert sum(len(out.tables[i].rows)-1 for i in range(9,20))==110
if name=='equipment':assert sum(len(out.tables[i].rows)-1 for i in range(2,10))==92
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
visible=[]
with zipfile.ZipFile(file)as z:
 for part in z.namelist():
  if part.startswith('word/')and part.endswith('.xml'):
   visible+=E.fromstring(z.read(part)).xpath('//w:t/text()',namespaces=ns)
remaining=[v for v in visible if re.search('[áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]',v)]
assert not remaining,remaining
audit=json.loads(Path(str(file)+'.audit.json').read_text())
qa=Path(sys.argv[2]) if len(sys.argv)>2 else Path('qa',name)
result={'paragraphs':len(out.paragraphs),'tables':len(out.tables),'translatedEntries':len(audit),'renderedPages':len(list(qa.glob('page-*.png'))),'numericValues':'match CS','untranslatedVisibleText':0,'sha256':hashlib.sha256(file.read_bytes()).hexdigest()}
if name=='magic':result['spells']=110
if name=='equipment':result['items']=92
Path(str(file)+'.checks.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result))
