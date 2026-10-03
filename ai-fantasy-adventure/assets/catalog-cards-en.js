(()=>{
'use strict';
const root=document.querySelector('#catalog-card-data');
if(!root)return;
const data=JSON.parse(root.textContent);
const main=document.querySelector('.explorer-main'),art=main?.querySelector('.asset-slot__image');
if(!main||!art)return;
const names={hero:'hero',equipment:'equipment',spell:'spell'};
function rounded(c,x,y,w,h,r){c.beginPath();c.roundRect(x,y,w,h,r)}
function loadImage(src){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error('The illustration could not be loaded.'));i.src=src;})}
function wrapped(c,text,width){const out=[];let line='';for(const word of String(text??'—').split(/\s+/)){const next=line?line+' '+word:word;if(line&&c.measureText(next).width>width){out.push(line);line=word;}else line=next;}if(line)out.push(line);return out;}
function drawCard(image,qr,logo){
 const canvas=document.createElement('canvas');canvas.width=1749;canvas.height=1241;const c=canvas.getContext('2d');
 c.fillStyle='#fff';c.fillRect(0,0,1749,1241);c.strokeStyle='#c9b78f';c.lineWidth=2;rounded(c,29,29,1691,1183,27);c.stroke();c.fillStyle='#805b30';c.fillRect(872,40,4,1160);
 c.save();c.shadowColor='rgba(0,0,0,.35)';c.shadowBlur=22;c.fillStyle='#0b141b';rounded(c,58,62,786,1116,32);c.fill();c.restore();c.save();rounded(c,65,69,772,1102,29);c.clip();const scale=Math.min(772/image.naturalWidth,1102/image.naturalHeight),w=image.naturalWidth*scale,h=image.naturalHeight*scale;c.drawImage(image,65+(772-w)/2,69+(1102-h)/2,w,h);c.restore();
 const x=944,width=744,limit=1096; c.fillStyle='#805b30';c.font='700 28px Arial';let catSize=28;while(c.measureText(data.category.toLocaleUpperCase('en')).width>635&&catSize>20){c.font='700 '+(--catSize)+'px Arial';}c.fillText(data.category.toLocaleUpperCase('en'),x,99);
 if(logo){c.save();rounded(c,1597,69,83,83,18);c.fillStyle='#0b141b';c.fill();c.clip();c.drawImage(logo,1601,73,75,75);c.restore();}
 let titleSize=82,titleLines;do{c.font='800 '+titleSize+'px Arial';titleLines=wrapped(c,data.title,width-10);if(titleLines.length<=2)break;titleSize-=2;}while(titleSize>=46);
 c.fillStyle='#24262b';let y=titleLines.length===1?245:193;for(const l of titleLines)c.fillText(l,x,y),y+=titleSize+5;
 const top=Math.max(297,y-titleSize+40);c.fillStyle='#805b30';c.fillRect(x,top,width,3);
 function layout(size,paint){
  let yy=top+43;const gap=size+6;const text=(str,xx,wy,max,bold=false)=>{c.font=(bold?'700 ':'400 ')+size+'px Arial';const ll=wrapped(c,str,max);if(paint){c.fillStyle='#24262b';ll.forEach((l,i)=>c.fillText(l,xx,wy+i*gap));}return ll.length*gap;};
  for(const section of data.sections){
   if(paint){c.fillStyle='#24262b';c.font='700 '+(size+3)+'px Arial';c.fillText(section.title,x,yy);}yy+=size+22;
   if(section.columns){
    const fs=section.fields;for(let i=0;i<fs.length;i+=2){let rh=0;for(let j=0;j<2&&i+j<fs.length;j++){const [key,value]=fs[i+j],xx=x+j*390;const hh=text(key,xx,yy,270);if(paint){c.font='400 '+size+'px Arial';c.textAlign='right';c.fillText(value,xx+338,yy);c.textAlign='left';}rh=Math.max(rh,hh);}yy+=rh+14;}
   }else if(section.fields){for(const [key,value] of section.fields){const kh=text(key,x,yy,220,true),vh=text(value,x+240,yy,width-240);yy+=Math.max(kh,vh)+11;}}
   if(section.text)yy+=text(section.text,x,yy,width);
   yy+=17;if(paint){c.fillStyle='#c9b78f';c.fillRect(x,yy-7,width,1);}yy+=9;
  }return yy;
 }
 let size=25;while(layout(size,false)>limit&&size>17)size--;if(layout(size,false)>limit)throw new Error('Card text exceeds the available space.');
 layout(size,true);c.fillStyle='#24262b';c.font='400 16px Arial';c.fillText('vinmat.eu/aifa/en',x,1200);c.imageSmoothingEnabled=false;c.drawImage(qr,1578,1108,110,110);return canvas;
}
function jpegPdf(canvas,title){const jpg=canvas.toDataURL('image/jpeg',.94),bin=atob(jpg.split(',')[1]),img=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)img[i]=bin.charCodeAt(i);const enc=new TextEncoder(),chunks=[],offsets=[0];let length=0;const add=(s)=>{const b=enc.encode(s);chunks.push(b);length+=b.length};const addObj=(n,head,stream)=>{offsets[n]=length;add(`${n} 0 obj\n${head}`);if(stream){add(`\nstream\n`);chunks.push(stream);length+=stream.length;add('\nendstream')}add('\nendobj\n')};
add('%PDF-1.4\n%âãÏÓ\n');addObj(1,'<< /Type /Catalog /Pages 2 0 R >>');addObj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');addObj(3,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 419.5276 297.6378] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');addObj(4,`<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.length} >>`,img);const stream=enc.encode('q 419.5276 0 0 297.6378 0 0 cm /Im0 Do Q');addObj(5,`<< /Length ${stream.length} >>`,stream);const xref=length;add('xref\n0 6\n0000000000 65535 f \n');for(let i=1;i<=5;i++)add(`${String(offsets[i]).padStart(10,'0')} 00000 n \n`);add(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);return new Blob(chunks,{type:'application/pdf'})}

const panel=document.createElement('section');panel.className='bestiary-print-panel info-panel';
const kicker=document.createElement('span');kicker.className='panel-kicker';kicker.textContent='FOR A BETTER GAME EXPERIENCE';
const title=document.createElement('h2');title.textContent='Card: '+data.title;
const note=document.createElement('p');note.textContent='Color '+names[data.kind]+' card in A6 format. You can print 4 pages per sheet.';
const actions=document.createElement('div');actions.className='bestiary-print-actions';const button=document.createElement('button');button.className='button button--gold';button.type='button';button.dataset.cardKind='color';button.textContent='Color card';actions.append(button);panel.append(kicker,title,note,actions);main.append(panel);
const dialog=document.createElement('dialog');dialog.className='bestiary-card-dialog';dialog.innerHTML='<div class="bestiary-card-dialog__header"><h2></h2><button class="bestiary-card-dialog__close" type="button" aria-label="Close">×</button></div><div class="bestiary-card-dialog__preview-wrap"><img class="bestiary-card-dialog__preview" alt=""></div><div class="bestiary-card-dialog__actions"><a class="button button--gold" download>Download PNG</a><a class="button button--outline" download>Download A6 PDF</a></div>';document.body.append(dialog);
let urls=[];dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
button.addEventListener('click',async()=>{button.disabled=true;try{
 const [image,qr,logo]=await Promise.all([loadImage(art.currentSrc||art.src),loadImage(data.qr),loadImage('/ai-fantasy-adventure/favicon.svg').catch(()=>null)]);
 const canvas=drawCard(image,qr,logo),png=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!png)throw new Error('PNG export failed');
 urls.forEach(u=>URL.revokeObjectURL(u));urls=[URL.createObjectURL(png),URL.createObjectURL(jpegPdf(canvas,data.title))];
 dialog.querySelector('h2').textContent='Color card: '+data.title;const preview=dialog.querySelector('img');preview.alt='Color card: '+data.title;preview.src=urls[0];
 const links=dialog.querySelectorAll('a');links[0].href=urls[0];links[0].download=data.slug+'-a6-color.png';links[1].href=urls[1];links[1].download=data.slug+'-a6-color.pdf';dialog.showModal();
 }catch(error){console.error('The card could not be prepared',error);alert('The card could not be prepared. Please reload the page.');}finally{button.disabled=false;}});
})();