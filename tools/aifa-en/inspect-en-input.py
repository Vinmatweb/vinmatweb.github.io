import sys,pathlib;sys.path.insert(0,'en-deps')
from bs4 import BeautifulSoup
for p in ['en-input-cs.html','en-input-old.html']:
 s=BeautifulSoup(pathlib.Path(p).read_text(),'html.parser');m=s.select_one('.explorer-main') or s.main;print(('CS: ' if 'cs' in p else 'OLD EN: ')+m.get_text(' ',strip=True));a=s.select_one('#catalog-card-data')
 if a:print('CARD:',a.string)