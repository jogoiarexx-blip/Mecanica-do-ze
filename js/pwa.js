if('serviceWorker' in navigator){
  window.addEventListener('load',async()=>{
    try{
      const reg=await navigator.serviceWorker.register('./sw.js');
      reg.update();
      navigator.serviceWorker.addEventListener('controllerchange',()=>console.log('Mecânica do Zé: nova versão ativa'));
    }catch(e){console.warn('SW error',e);}
  });
}