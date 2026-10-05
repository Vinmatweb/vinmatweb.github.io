from pathlib import Path
import json,re,sys,copy
from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def replace_paragraph(p,text):
    # Preserve paragraph style, layout, and the original leading number's run.
    old=p.text
    runs=p.runs
    field_runs=[r for r in runs if r._r.xpath('.//w:fldChar | .//w:instrText')]
    if field_runs:
        field_text=''.join(r.text for r in field_runs)
        if field_text and not text.endswith(field_text):raise ValueError(('field placement',old,text))
        static_text=text[:-len(field_text)] if field_text else text
        plain_runs=[r for r in runs if r not in field_runs]
        leading=next((r for r in plain_runs if r.text),plain_runs[0])
        leading.text=static_text
        for r in plain_runs:
            if r is not leading:r.text=''
        return
    prefix=re.match(r"^\d+\.\s+",old)
    if prefix and len(runs)>1 and runs[0].text==prefix.group() and text.startswith(prefix.group()):
        runs[1].text=text[len(prefix.group()):]
        for run in runs[2:]:run.text=""
    elif runs:
        leading=next((run for run in runs if run.text),runs[0])
        leading.text=text
        for run in runs:
            if run is not leading:run.text=""
    else:p.add_run(text)

def translate(source,target,paragraph_map,cell_map,allowed=(),remove_forced_breaks=True):
    doc=Document(source)
    missing=[]
    evidence=[]
    def check(old,new,where):
        # Rule values, ranges and section references must remain unchanged.
        nums=lambda s: [n.replace(",",".") for n in re.findall(r"\d+(?:[.,]\d+)?",s)]
        a,b=nums(old),nums(re.sub(r"\bOnce\b","1",new,flags=re.I) if "1×" in old else new)
        if a!=b:raise ValueError((where,"numeric mismatch",a,b))
        evidence.append({"location":where,"cs":old,"en":new})
    for i,p in enumerate(doc.paragraphs):
        old=p.text
        if not old.strip():continue
        new=paragraph_map.get(str(i))
        if new is None:
            if old not in allowed:missing.append((f"P{i}",old))
            continue
        check(old,new,f"P{i}");replace_paragraph(p,new)
    seen=set()
    for ti,t in enumerate(doc.tables):
        for ri,row in enumerate(t.rows):
            for ci,c in enumerate(row.cells):
                if c._tc in seen:continue
                seen.add(c._tc)
                old=c.text
                if not old.strip():continue
                new=cell_map.get(old)
                if new is None:
                    if re.search(r"[A-Za-zÀ-ž]",old) and old not in allowed:missing.append((f"T{ti}R{ri}C{ci}",old))
                    continue
                check(old,new,f"T{ti}R{ri}C{ci}")
                lines=new.split("\n")
                if len(c.paragraphs)==len(lines):
                    for p,line in zip(c.paragraphs,lines):replace_paragraph(p,line)
                elif len(c.paragraphs)==1:replace_paragraph(c.paragraphs[0],new)
                else:raise ValueError(("cell paragraph mismatch",ti,ri,ci,len(c.paragraphs),len(lines)))
    if missing:raise ValueError(("untranslated",missing))
    # Extra English line lengths must not spill before a forced chapter break.
    for i,p in enumerate(doc.paragraphs):
        if remove_forced_breaks and i>9:
            for br in p._p.xpath('.//w:br[@w:type="page"]'):br.getparent().remove(br)
    for section in doc.sections:
        for part in [section.header,section.footer,section.first_page_header,section.first_page_footer,section.even_page_header,section.even_page_footer]:
            for p in part.paragraphs:
                old=p.text
                new=cell_map.get(old)
                if new is not None:
                    check(old,new,"header/footer");replace_paragraph(p,new)
                elif re.search(r"[áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]",old):raise ValueError(("untranslated header/footer",old))
    # Localise proofing and metadata without changing source design.
    if not remove_forced_breaks:
        for table in doc.tables:
            for row in table.rows:
                trpr=row._tr.get_or_add_trPr()
                if trpr.find(qn('w:cantSplit')) is None:trpr.append(OxmlElement('w:cantSplit'))
    for p in doc.element.iter(qn("w:p")):
        for r in p.findall(qn("w:r")):
            rp=r.find(qn("w:rPr"))
            if rp is None:rp=OxmlElement("w:rPr");r.insert(0,rp)
            lang=rp.find(qn("w:lang"))
            if lang is None:lang=OxmlElement("w:lang");rp.append(lang)
            lang.set(qn("w:val"),"en-GB")
    doc.core_properties.author="VinMat"
    doc.core_properties.last_modified_by="VinMat"
    doc.core_properties.language="en-GB"
    doc.core_properties.title=paragraph_map.get("2",doc.core_properties.title)
    Path(target).parent.mkdir(parents=True,exist_ok=True)
    doc.save(target)
    Path(target+".audit.json").write_text(json.dumps(evidence,ensure_ascii=False,indent=2))
    out=Document(target)
    assert len(out.paragraphs)==len(doc.paragraphs) and [(len(t.rows),len(t.columns)) for t in out.tables]==[(len(t.rows),len(t.columns)) for t in doc.tables]
    print(json.dumps({"output":target,"translated_entries":len(evidence),"paragraphs":len(out.paragraphs),"tables":len(out.tables)},ensure_ascii=False))

if __name__=="__main__":
    root=Path("translations");pm={}
    for f in sorted(root.glob("manual-p*.json")):pm.update(json.loads(f.read_text()))
    cm=json.loads((root/"manual-tables.json").read_text())
    translate("sources/manual-cs.docx","outputs/AI_Fantasy_Adventure_Manual_v1_0_EN.docx",pm,cm,["VINMAT PRESENTS","AI FANTASY\nADVENTURE","Elf","Bard","Charisma","CHA","Level","XP"])
