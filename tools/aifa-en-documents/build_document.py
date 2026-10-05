from pathlib import Path
import json,sys
from translate_docx import translate
name=sys.argv[1]
targets={'magic':'AI_Fantasy_Adventure_Magic_and_Spell_Catalogue_v1_0_EN.docx','equipment':'AI_Fantasy_Adventure_Equipment_Catalogue_v1_0_EN.docx'}
translate(f'sources/{name}-cs.docx',f'outputs/{targets[name]}',json.loads(Path(f'translations/{name}-paragraphs.json').read_text()),json.loads(Path(f'translations/{name}-tables.json').read_text()),['VINMAT PRESENTS','AI FANTASY ADVENTURE','Elf','Bard','CHA','Level','XP'],remove_forced_breaks=False)
