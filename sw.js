const CACHE_NAME='mecanica-ze-v5';
const PRECACHE=[
 './','./index.html','./manifest.json',
 './css/game.css','./css/mobile.css',
 './js/game.js','./js/mobile-controls.js','./js/pwa.js',
 './icon-192.png','./icon-512.png'
];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(PRECACHE)));
 self.skipWaiting();
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
 self.clients.claim();
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 if(event.request.mode==='navigate'){
   event.respondWith(fetch(event.request).then(res=>{
     if(!res || !res.ok) throw new Error('navigation failed');
     const copy=res.clone();
     caches.open(CACHE_NAME).then(c=>c.put('./index.html',copy));
     return res;
   }).catch(()=>caches.match('./index.html').then(cached=>cached||Response.error())));
   return;
 }
 event.respondWith(caches.match(event.request).then(cached=>{
   const network=fetch(event.request).then(res=>{if(res&&res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(event.request,copy));}return res;}).catch(()=>cached);
   return cached||network;
 }));
});