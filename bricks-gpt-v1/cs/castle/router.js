import {FACTION_ROUTES} from './routes.js';

export const BASE=document.querySelector('base').getAttribute('href');
const factionIDs=Object.fromEntries(Object.entries(FACTION_ROUTES).map(([id,slug])=>[slug,id]));
export function routeURL(legacy){
 const [type,id]=legacy.replace(/^#\/?/,'').split('/');
 if(type==='frakce')return BASE+FACTION_ROUTES[id]+'/';
 if(type==='set')return BASE+'sety/'+id+'/';
 if(type==='minifigurka')return BASE+'minifigurky/'+id+'/';
 const section={bdp:'bricklink-designer-program',dostupne:'dostupnost'}[type]||type;
 return BASE+(section?section+'/':'');
}
export function parseRoute(){
 if(!location.pathname.startsWith(BASE))return ['missing'];
 const parts=location.pathname.slice(BASE.length).replace(/\/$/,'').split('/').map(decodeURIComponent);
 const [slug,id]=parts;
 if(!slug)return [''];
 if(factionIDs[slug]&&parts.length===1)return ['frakce',factionIDs[slug]];
 if(slug==='sety')return id?['set',id]:['sety'];
 if(slug==='minifigurky')return id?['minifigurka',id]:['minifigurky'];
 return [{ 'bricklink-designer-program':'bdp','dostupnost':'dostupne','zdroje':'zdroje'}[slug]||'missing'];
}
export function normalizeLinks(){
 document.querySelectorAll('a[href^="#/"]').forEach(a=>a.setAttribute('href',routeURL(a.getAttribute('href'))));
 const canonical=document.querySelector('link[rel="canonical"]');
 if(canonical)canonical.href='https://vinmat.eu'+location.pathname;
}
