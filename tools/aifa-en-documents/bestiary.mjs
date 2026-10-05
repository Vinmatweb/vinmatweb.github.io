import fs from 'node:fs/promises';
import {FileBlob,SpreadsheetFile} from '@oai/artifact-tool';
const base='/workspace/scratch/c6a82eb4883e';
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(`${base}/sources/bestiary-cs.xlsx`));
console.log((await wb.inspect({kind:'workbook,sheet,table',maxChars:3000,tableMaxRows:3,tableMaxCols:5})).ndjson);
const source=JSON.parse(await fs.readFile(`${base}/sources/bestiary-cells.json`,'utf8'));
const map=JSON.parse(await fs.readFile(`${base}/translations/bestiary.json`,'utf8'));
const names=['Overview','Bestiary','Groups','Defensive Specialisations','Bosses','XP','Rules and Compatibility'];
let translated=0,formulaCount=0;
for(let i=0;i<source.length;i++){
 const sheet=wb.worksheets.getItem(source[i].name);
 sheet.name=names[i];
 if(sheet.name!==names[i]) throw Error('Sheet rename failed');
 for(const cell of source[i].cells){
  if(cell.formula){
   const formula=cell.formula.replaceAll('"S"','"STR"');
   if(formula!==cell.formula)sheet.getRange(cell.address).formulas=[['='+formula]];
   formulaCount++; continue;
  }
  if(['str','s','inlineStr'].includes(cell.type)&&cell.value){
   if(map[cell.value]===undefined)throw Error('Missing: '+cell.value);
   sheet.getRange(cell.address).values=[[map[cell.value]]];translated++;
  }
 }
}
const bosses=wb.worksheets.getItem('Bosses');
bosses.getRange('E1:E32').format.columnWidth=40;
bosses.getRange('A17:E25').format.verticalAlignment='top';
wb.recalculate();
console.log((await wb.inspect({kind:'region',sheetId:'Bestiary',range:'A1:K4',maxChars:1800,tableMaxCols:11,tableMaxRows:4})).ndjson);
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:20},maxChars:1500})).ndjson);
const views=[['Overview','A1:H10'],['Bestiary','A1:K18'],['Bestiary','L1:AB18'],['Bestiary','L19:AB40'],['Bestiary','L41:AB63'],['Groups','A1:D22'],['Defensive Specialisations','A1:F11'],['Defensive Specialisations','A12:F21'],['Bosses','A1:J9'],['Bosses','A10:J15'],['Bosses','A16:J32'],['XP','A1:H18'],['Rules and Compatibility','A1:F20']];
await fs.mkdir(`${base}/qa/bestiary`,{recursive:true});
for(let i=0;i<views.length;i++){
 const [sheetName,range]=views[i];const preview=await wb.render({sheetName,range,scale:1,format:'png'});
 await fs.writeFile(`${base}/qa/bestiary/view-${i+1}.png`,new Uint8Array(await preview.arrayBuffer()));
}
const output=await SpreadsheetFile.exportXlsx(wb);
await output.save(`${base}/outputs/AI_Fantasy_Adventure_Bestiary_v1_0_EN.xlsx`);
console.log(JSON.stringify({translated,formulaCount,sheets:names}));
