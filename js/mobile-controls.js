(()=>{
 const touchMode=window.matchMedia('(hover: none) and (pointer: coarse)');
 const zone=document.getElementById('joy-zone');
 const stick=document.getElementById('joy-stick');
 const arrows={up:document.getElementById('dpad-up'),down:document.getElementById('dpad-down'),left:document.getElementById('dpad-left'),right:document.getElementById('dpad-right')};
 let pointerId=null, originX=0, originY=0;
 const DEAD=8, MAX=52;
 function setJoy(dx,dy){joyDX=dx;joyDY=dy;arrows.up?.classList.toggle('active',dy<-.3);arrows.down?.classList.toggle('active',dy>.3);arrows.left?.classList.toggle('active',dx<-.3);arrows.right?.classList.toggle('active',dx>.3);}
 function moveStick(cx,cy){if(stick)stick.style.transform=`translate(calc(-50% + ${cx}px), calc(-50% + ${cy}px))`;}
 function startJoy(e){if(pointerId!==null)return;pointerId=e.pointerId;zone.setPointerCapture?.(e.pointerId);const rect=zone.getBoundingClientRect();originX=e.clientX-rect.left;originY=e.clientY-rect.top;e.preventDefault();SFX?._init?.();}
 function moveJoy(e){if(e.pointerId!==pointerId)return;const rect=zone.getBoundingClientRect();let ox=e.clientX-rect.left-originX,oy=e.clientY-rect.top-originY;const dist=Math.hypot(ox,oy);const cap=Math.min(dist,MAX);const a=Math.atan2(oy,ox);const cx=Math.cos(a)*cap,cy=Math.sin(a)*cap;moveStick(cx,cy);setJoy(dist>DEAD?cx/MAX:0,dist>DEAD?cy/MAX:0);e.preventDefault();}
 function endJoy(e){if(e.pointerId!==pointerId)return;pointerId=null;moveStick(0,0);setJoy(0,0);}
 zone?.addEventListener('pointerdown',startJoy);zone?.addEventListener('pointermove',moveJoy);zone?.addEventListener('pointerup',endJoy);zone?.addEventListener('pointercancel',endJoy);
 function action(name){
   if(currentGameState!==GAME_STATE.PLAYING||window.isGameplayBlocked?.())return;
   if(name==='fix')doFix();
   else if(name==='diag'){nearShop()?openPartsShop():doDiagnose();}
   else if(name==='shop'){if(nearCantine())openFoodMenu();else if(nearShop())openPartsShop();else if(!hasCantine&&nearCantineArea())buyCantineInWorld();else doDiagnose();}
   else if(name==='rest')doRestock();
 }
 document.querySelectorAll('.mob-btn').forEach(btn=>{const map={'btn-fix':'fix','btn-diag':'diag','btn-shop':'shop','btn-rest':'rest'};const name=map[btn.id];btn.addEventListener('pointerdown',e=>{e.preventDefault();btn.classList.add('pressed');SFX?._init?.();action(name);});['pointerup','pointercancel','pointerleave'].forEach(t=>btn.addEventListener(t,()=>btn.classList.remove('pressed')));});
 document.getElementById('btn-pause-mob')?.addEventListener('pointerdown',e=>{e.preventDefault();if(currentGameState===GAME_STATE.PLAYING)pauseGame();else if(currentGameState===GAME_STATE.PAUSE)resumeGame();});
 function updateOrientation(){const ov=document.getElementById('rotate-device');if(!ov)return;const portrait=innerHeight>innerWidth;ov.style.display=touchMode.matches&&portrait?'flex':'none';if(portrait&&currentGameState===GAME_STATE.PLAYING)pauseGame();}
 addEventListener('resize',updateOrientation);addEventListener('orientationchange',()=>setTimeout(updateOrientation,100));updateOrientation();
 if(touchMode.matches){document.getElementById('controls')?.style.setProperty('display','none');}
})();