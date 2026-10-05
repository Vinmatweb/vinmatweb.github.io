from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib,json

files=['AI_Fantasy_Adventure_Manual_v1_0_EN.docx','AI_Fantasy_Adventure_Bestiary_v1_0_EN.xlsx','AI_Fantasy_Adventure_Magic_and_Spell_Catalogue_v1_0_EN.docx','AI_Fantasy_Adventure_Equipment_Catalogue_v1_0_EN.docx']
root=Path('outputs');target=root/'AI_Fantasy_Adventure_v1_0_complete_EN.zip'
with ZipFile(target,'w',ZIP_DEFLATED) as archive:
    for name in files:archive.write(root/name,arcname=name)
with ZipFile(target) as archive:
    assert archive.testzip() is None
    assert archive.namelist()==files
    for name in files:assert archive.read(name)==(root/name).read_bytes()
checks={'files':files,'fileCount':4,'integrity':'pass','contents':'match verified English documents','sha256':hashlib.sha256(target.read_bytes()).hexdigest()}
Path(str(target)+'.checks.json').write_text(json.dumps(checks,indent=2))
print(json.dumps(checks))
