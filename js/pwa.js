if('serviceWorker' in navigator){
  let reloading=false;
  function showUpdateBanner(reg){
    if(document.getElementById('pwa-update-banner'))return;
    const b=document.createElement('div');b.id='pwa-update-banner';
    b.innerHTML='<span>🔄 Nova versão disponível</span><button>ATUALIZAR</button>';
    b.style.cssText='position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9999;background:#111827;color:#fff;border:2px solid #f59e0b;border-radius:9px;padding:9px 12px;font:12px VT323,monospace;display:flex;gap:12px;align-items:center;box-shadow:0 8px 30px rgba(0,0,0,.5)';
    const btn=b.querySelector('button');btn.style.cssText='background:#f59e0b;color:#111;border:0;border-radius:5px;padding:6px 10px;font-weight:bold;cursor:pointer';
    btn.onclick=()=>{const sw=reg.waiting;if(sw)sw.postMessage({type:'SKIP_WAITING'});};document.body.appendChild(b);
  }
  window.addEventListener('load',async()=>{
    try{
      const reg=await navigator.serviceWorker.register('./sw.js');
      if(reg.waiting)showUpdateBanner(reg);
      reg.addEventListener('updatefound',()=>{const nw=reg.installing;if(!nw)return;nw.addEventListener('statechange',()=>{if(nw.state==='installed'&&navigator.serviceWorker.controller)showUpdateBanner(reg);});});
      navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading)return;reloading=true;location.reload();});
      reg.update();
    }catch(e){console.warn('SW error',e);}
  });
}
