from pathlib import Path
import zipfile,json,re,hashlib
from lxml import etree as E
n={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
source=json.loads(Path('sources/bestiary-cells.json').read_text())
mapping=json.loads(Path('translations/bestiary.json').read_text())
target=Path('outputs/AI_Fantasy_Adventure_Bestiary_v1_0_EN.xlsx')
with zipfile.ZipFile(target)as z:
    ss=[]
    if 'xl/sharedStrings.xml'in z.namelist():ss=[''.join(e.xpath('.//s:t/text()',namespaces=n))for e in E.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si',n)]
    names=[s.get('name')for s in E.fromstring(z.read('xl/workbook.xml')).findall('s:sheets/s:sheet',n)]
    numeric=0;formulas=0;texts=0
    for i,sheet in enumerate(source,1):
        root=E.fromstring(z.read(f'xl/worksheets/sheet{i}.xml'))
        cells={c.get('r'):c for c in root.findall('.//s:sheetData/s:row/s:c',n)}
        for old in sheet['cells']:
            if old['value'] is None and old['formula'] is None:continue
            c=cells[old['address']];v=c.findtext('s:v',namespaces=n)
            if c.get('t')=='s':v=ss[int(v)]
            elif c.get('t')=='inlineStr':v=''.join(c.xpath('.//s:t/text()',namespaces=n))
            if old['formula']:
                assert c.findtext('s:f',namespaces=n)==old['formula'].replace('"S"','"STR"'),(i,old['address'],'formula')
                assert float(v)==float(old['value']),(i,old['address'],v,old['value'])
                formulas+=1
            elif old['type']=='n':
                assert float(v)==float(old['value']),(i,old['address'],'numeric')
                numeric+=1
            elif old['value']:
                assert v==mapping[old['value']],(i,old['address'],v,mapping[old['value']])
                assert not re.search('[áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]',v),v
                texts+=1
    result={'sheets':names,'creatures':62,'bosses':9,'translatedCells':texts,'numericCells':numeric,'formulas':formulas,'numericValues':'match CS','untranslatedVisibleText':0,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}
    Path(str(target)+'.audit.json').write_text(json.dumps(result,indent=2))
    print(json.dumps(result))
