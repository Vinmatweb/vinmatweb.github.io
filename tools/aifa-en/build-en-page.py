import sys,json,re,pathlib,io,base64
ROOT=pathlib.Path(__file__).parent
sys.path.insert(0,str(ROOT/'en-deps'))
from bs4 import BeautifulSoup,Comment,Doctype
import qrcode,cv2,numpy as np
catalog=json.loads((ROOT/'en-catalog.json').read_text());common=json.loads((ROOT/'en-common-translations.json').read_text());links=json.loads((ROOT/'en-link-map.json').read_text());base='/ai-fantasy-adventure'
def enlink(url):
 if url in links:return links[url]
 if not url.startswith(base) or url.startswith(base+'/en/'):return url
 path,sep,frag=url.partition('#');clean=path.rstrip('/')
 for e in catalog:
  if clean=='/'+e['path'].removesuffix('/index.html'):return '/'+e['enPath'].removesuffix('index.html')+sep+frag
 if '/assets/' in url or '/downloads/' in url:return url
 anchors={'obtiznost':'difficulty','vlastnosti':'attributes','silna-slaba':'strong-weak','boj':'combat','schopnosti':'abilities','doporuceny-pocet':'recommended-count'}
 if clean in links:return links[clean].rstrip('/')+'/'+sep+anchors.get(frag,frag)
 if path.rstrip('/')+'/' in links:return links[path.rstrip('/')+'/']+sep+anchors.get(frag,frag)
 raise ValueError('Unmapped link '+url)
def build(key):
 e=next(x for x in catalog if x['key']==key);source=(ROOT/'en-input-cs.html').read_text();s=BeautifulSoup(source,'html.parser');t=json.loads((ROOT/'en-input-translation.json').read_text())
 original_stats=[x.get_text(strip=True) for x in s.select('.stat-table strong,.attribute-grid strong,.derived-stat-grid strong')];original_image=s.select_one('.asset-slot__image')['src']
 source_name=s.h1.get_text(' ',strip=True);d={**common,**t.get('strings',{}),source_name:t['name']};missing=set()
 profile=s.select_one('.beast-profile,.catalog-profile');assert profile and len(profile.select('p'))==len(t['profile'])==3
 for p,v in zip(profile.select('p'),t['profile']):p.clear();p.append(v)
 def translate(v):
  c=v.strip()
  if not c or c in t['profile'] or not any(x.isalpha() for x in c):return v
  if c in d:return v.replace(c,d[c])
  if c.startswith('©') or c in ['AI Fantasy Adventure','AI Fantasy','Adventure','Elaria','Vaelor','VinMat','CZ','EN','html','English edition','bonus']:return v
  if c.startswith('Obtížnost '):return 'Challenge '+c.split()[-1]
  if re.fullmatch(r'\d+ hráči',c):return c.replace('hráči','players')
  if re.fullmatch(r'(CHA|CH|S|O|Š)\d+',c):return re.sub(r'^(CHA|CH|S|O|Š)',lambda m:d[m[1]],c)
  if re.fullmatch(r'\d+ z(?: \d+ s)?|\d+ s',c):return re.sub(r'\bz\b','gp',re.sub(r'\bs\b','sp',c))
  if c in ['1R','2R']:return c.replace('R','H')
  missing.add(c);return v
 for n in list(s.find_all(string=True)):
  if isinstance(n,(Comment,Doctype)) or n.parent.name in ['script','style','title']:continue
  n.replace_with(translate(str(n)))
 s.html['lang']='en'
 for main in s.find_all('main'):main['lang']='en'
 for x in s.find_all(True):
  for attr in ['aria-label','title','placeholder']:
   if x.has_attr(attr):x[attr]=translate(x[attr])
  if x.has_attr('alt'):x['alt']='Color fantasy illustration of '+t['name'] if 'asset-slot__image' in x.get('class',[]) else translate(x['alt'])
  if x.name=='a' and x.has_attr('href'):x['href']=enlink(x['href'])
 for x in s.select('script[src]'):
  if 'bestiary-cards.js' in x['src']:x['src']=base+'/assets/bestiary-cards-en.js?v=en-1'
  if 'catalog-cards.js' in x['src']:x['src']=base+'/assets/catalog-cards-en.js?v=en-1'
 s.title.string=t['name']+' | AI Fantasy Adventure';canonical='https://vinmat.eu/'+e['enPath'].removesuffix('index.html')
 for x in s.select('link[rel="canonical"],link[rel="alternate"]'):x.decompose()
 for attrs in [{'rel':'canonical','href':canonical},{'rel':'alternate','hreflang':'cs','href':'https://vinmat.eu/'+e['path'].removesuffix('index.html')},{'rel':'alternate','hreflang':'en','href':canonical}]:s.head.append(s.new_tag('link',attrs=attrs))
 meta={'description':t['profile'][0][:157],'keywords':'AI Fantasy Adventure,family RPG,fantasy game for children,AI Game Master','og:title':t['name'],'og:description':t['profile'][0][:157],'og:locale':'en_US','og:image:alt':'Heroes of AI Fantasy Adventure','twitter:title':t['name'],'twitter:description':t['profile'][0][:157]}
 for x in s.find_all('meta'):
  k=x.get('name',x.get('property'))
  if k in meta:x['content']=meta[k]
 for x in s.select('script[type="application/ld+json"]'):
  data=json.loads(x.string);data['description']='A cooperative fantasy RPG for children and parents with an AI Game Master.';x.string=json.dumps(data,ensure_ascii=False)
 switch=s.select_one('.language-switch');switch['class']=list(switch.get('class',[]))+['language-switch--fixed'];switch.clear();a=s.new_tag('a',href='/'+e['path'].removesuffix('index.html'));a.string='CZ';switch.append(a);a=s.new_tag('strong');a.string='EN';switch.append(a)
 payload=s.select_one('#catalog-card-data')
 if payload:
  data=json.loads(payload.string)
  def trans(v):
   if isinstance(v,str):return translate(v)
   if isinstance(v,list):return [trans(x) for x in v]
   if isinstance(v,dict):return {k:trans(x) for k,x in v.items()}
   return v
  for f in ['title','category','sections']:
   if f in data:data[f]=trans(data[f])
  data['title']=t['name'];data['qr']=base+'/assets/catalog-qr-en/'+key+'.png?v=en-1';payload.string=json.dumps(data,ensure_ascii=False).replace('<','\\u003c');card=data
 else:
  kicker=s.select_one('.detail-hero .kicker').get_text(' ',strip=True);stats=[{'label':r.span.get_text(' ',strip=True),'value':r.strong.get_text(strip=True)} for r in s.select('.stat-table>div')]
  traits={r.strong.get_text(strip=True).replace(':','').lower():r.select_one('span,a').get_text(' ',strip=True) for r in s.select('.beast-traits li')};ability=next(r for r in s.select('article') if r.select_one('.panel-kicker') and r.select_one('.panel-kicker').get_text(strip=True)=='Special ability');gear={r.dt.get_text(' ',strip=True):r.dd.get_text(' ',strip=True) for r in s.select('details.mechanics-details dl>div')}
  card={'title':t['name'],'category':kicker.split('·')[0].strip(),'difficulty':re.search(r'Challenge\s*(\d+)',kicker)[1],'stats':stats,'traits':traits,'abilityTitle':ability.h2.get_text(' ',strip=True),'abilityText':ability.p.get_text(' ',strip=True),'gear':['Attack: '+gear['Attack']+' · Protection: '+gear['Protection'],'Shield: '+gear['Shield']+' · Spell bonus '+gear['Spell bonus']+' · Magic protection '+gear['Magic protection']]}
 if missing:raise ValueError('Untranslated strings: '+json.dumps(sorted(missing),ensure_ascii=False))
 assert original_stats==[x.get_text(strip=True) for x in s.select('.stat-table strong,.attribute-grid strong,.derived-stat-grid strong')];assert original_image==s.select_one('.asset-slot__image')['src'];assert 'Černobílá karta' not in str(s)
 (ROOT/'en-output.html').write_text(str(s));(ROOT/'en-card-test-data.json').write_text(json.dumps(card,ensure_ascii=False));url='https://vinmat.eu/'+e['short'];detector=cv2.QRCodeDetector()
 for mask in [None,0,1,2,3,4,5,6,7]:
  q=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,box_size=10,border=4,mask_pattern=mask);q.add_data(url);q.make(fit=True);buf=io.BytesIO();q.make_image().save(buf,format='PNG');raw=buf.getvalue()
  if detector.detectAndDecode(cv2.imdecode(np.frombuffer(raw,dtype=np.uint8),cv2.IMREAD_GRAYSCALE))[0]==url:break
 else:raise ValueError('QR decoding failed')
 (ROOT/'en-output-qr.txt').write_text(base64.b64encode(raw).decode());print(json.dumps({'key':key,'name':t['name'],'paragraphs':3,'stats':'match CS','qr':url},ensure_ascii=False))
if __name__=='__main__':build(sys.argv[1])