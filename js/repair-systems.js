// Mecânica do Zé — subsistema visual/feedback de reparos v3.0.0
// Script clássico: compartilha o contexto global do engine.

function getRepairStage(car){
 const pct=Math.max(0,Math.min(1,(car?.workProgress||0)/(car?.maxWork||1)));
 return pct<0.33?1:pct<0.66?2:3;
}
function getRepairFx(problemName,stage){
 const st=Math.max(1,Math.min(3,stage||1));
 if(['Elétrica','Bateria','Farol'].includes(problemName)) return {color:'#60a5fa',symbol:st===3?'⚡':'✦',count:st===3?5:8};
 if(['Pneu','Freio','Aquaplanagem'].includes(problemName)) return {color:problemName==='Aquaplanagem'?'#38bdf8':'#ef4444',symbol:st===1?'◌':'✦',count:st===3?4:7};
 if(['Óleo'].includes(problemName)) return {color:'#a16207',symbol:'●',count:st===3?3:6};
 if(['Radiador','Superaquecimento'].includes(problemName)) return {color:problemName==='Superaquecimento'?'#f87171':'#93c5fd',symbol:'≈',count:st===3?3:6};
 if(['Transmissão','Correia'].includes(problemName)) return {color:'#a78bfa',symbol:'⚙',count:st===3?4:7};
 return {color:'#fbbf24',symbol:'✦',count:st===3?4:8};
}
function spawnRepairFx(car,actor=player){
 const stage=getRepairStage(car);
 const fx=getRepairFx(car.problem?.name,stage);
 const pos=getRepairEffectPoint(car,'fix',actor);
 spawnParticles(pos.x,pos.y,fx.color,fx.count);
 spawnFloatText(pos.x,pos.y-8,`${fx.symbol} ${stage===1?'DESMONTANDO':stage===2?'INSTALANDO':'AJUSTANDO'}`,fx.color);
 return stage;
}

function isCarActivelyWorked(car){
 if(playerWorkTask?.car===car && (playerWorkTask.phase==='approach'||playerWorkTask.phase==='working')) return true;
 return helpers.some(h=>h.targetCar===car&&(h.state===HELPER_STATES.MOVING||h.state===HELPER_STATES.DIAGNOSING||h.state===HELPER_STATES.FIXING));
}
function drawRepairVehicleVisuals(car,bx,by,cw,ch){
 if(!car||!car.problem)return;
 const active=isCarActivelyWorked(car);
 const finished=!!car.fixed&&car.completionTimer>0;
 const diagnosed=!!car.diagnosed;
 const name=car.problem.name;
 const pct=Math.max(0,Math.min(1,(car.workProgress||0)/(car.maxWork||1)));
 const phase=finished?3:(!diagnosed||pct<=0?0:(pct<0.33?1:(pct<0.66?2:3)));
 const phaseLabel=phase===1?'DESMONTANDO':phase===2?'INSTALANDO':phase===3?'AJUSTE FINAL':'';
 const pulse=0.55+0.45*Math.sin(tick*0.18);
 const slow=0.55+0.45*Math.sin(tick*0.08);
 const jiggle=Math.sin(tick*0.25)*2;
 const frontY=by+ch*0.70;
 const topY=by+ch*0.16;
 const cx=bx+cw/2;
 const frontGroup=['Motor','Óleo','Bateria','Elétrica','Correia','Radiador','Superaquecimento'];
 const wheelGroup=['Pneu','Freio','Aquaplanagem'];
 const isFront=frontGroup.includes(name);
 const isWheel=wheelGroup.includes(name);
 const hoodTilt=!isFront?0:(phase===0?0.10:phase===1?0.24:phase===2?0.20:0.14);
 const partOffsetX=phase===1?cw*0.24:phase===2?cw*0.11:cw*0.02;
 const partOffsetY=phase===1?-ch*0.10+jiggle:phase===2?-ch*0.05:0;
 ctx.save();
 ctx.imageSmoothingEnabled=false;
 if(diagnosed){
   ctx.globalAlpha=0.22+0.14*slow;
   ctx.strokeStyle=car.problem.color||'#f59e0b';
   ctx.lineWidth=2;
   ctx.setLineDash([5,4]);
   ctx.strokeRect(bx+2,by+2,cw-4,ch-4);
   ctx.setLineDash([]);
 }
 ctx.globalAlpha=1;
 function drawDetachedPart(x,y,w,h,label,color){
   ctx.fillStyle='rgba(0,0,0,.28)';
   ctx.beginPath();ctx.ellipse(x+w/2,y+h+4,w*0.45,h*0.18,0,0,Math.PI*2);ctx.fill();
   ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,3);ctx.fill();
   ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1;ctx.strokeRect(x,y,w,h);
   ctx.fillStyle='rgba(255,255,255,.85)';ctx.font='bold 9px VT323';ctx.textAlign='center';
   ctx.fillText(label,x+w/2,y+h/2+3);
 }
 if(isFront){
   ctx.save();
   ctx.translate(cx,frontY);
   ctx.rotate(-hoodTilt);
   const hg=ctx.createLinearGradient(-cw*0.28,-ch*0.12,cw*0.28,ch*0.06);
   hg.addColorStop(0,'rgba(30,30,30,0.95)');hg.addColorStop(1,'rgba(70,70,70,0.96)');
   ctx.fillStyle=hg;ctx.fillRect(-cw*0.28,-ch*0.12,cw*0.56,ch*0.18);
   ctx.strokeStyle='rgba(220,220,220,.35)';ctx.lineWidth=1;ctx.strokeRect(-cw*0.28,-ch*0.12,cw*0.56,ch*0.18);
   ctx.restore();
 }
 if(name==='Motor'){
   const ex=cx-cw*0.16,ey=frontY-ch*0.08,ew=cw*0.32,eh=ch*0.13;
   if(phase===1) drawDetachedPart(cx+partOffsetX,ey+partOffsetY,cw*0.18,ch*0.10,'M','#2f2f2f');
   ctx.globalAlpha=phase===1?0.35:1;
   ctx.fillStyle='#222';ctx.fillRect(ex,ey,ew,eh);
   ctx.strokeStyle='#777';ctx.lineWidth=1;
   for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(cx-cw*0.12+i*cw*0.12,frontY-ch*0.06);ctx.lineTo(cx-cw*0.12+i*cw*0.12,frontY+ch*0.03);ctx.stroke();}
   ctx.globalAlpha=1;
   if(active){ctx.fillStyle=`rgba(251,191,36,${0.35+0.35*pulse})`;ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillText(phase===1?'⬆':phase===2?'↘':'✦',cx+Math.sin(tick)*cw*0.12,frontY-ch*0.11);}
 }
 if(name==='Óleo'){
   const puddleW=phase===1?cw*0.16:phase===2?cw*0.11:cw*0.08;
   ctx.fillStyle='rgba(30,20,5,.82)';ctx.beginPath();ctx.ellipse(cx+cw*0.05,frontY+ch*0.16,puddleW,ch*0.055,0,0,Math.PI*2);ctx.fill();
   if(phase===1) drawDetachedPart(cx+cw*0.18,frontY-ch*0.02+jiggle,cw*0.10,ch*0.08,'O','#7c5a10');
   if(active&&tick%12<6){ctx.fillStyle='#3b2f0b';ctx.beginPath();ctx.arc(cx+cw*0.08,frontY+ch*0.08,2+2*pulse,0,Math.PI*2);ctx.fill();}
 }
 if(name==='Bateria'){
   const bx2=cx-cw*0.08,by2=frontY-ch*0.07,bw=cw*0.16,bh=ch*0.10;
   if(phase===1) drawDetachedPart(cx+cw*0.18,by2+partOffsetY,bw,bh,'+ -','#1f2937');
   const shift=phase===2?cw*0.06:0;
   ctx.fillStyle='#1f2937';ctx.fillRect(bx2+shift,by2,bw,bh);
   ctx.fillStyle='#ef4444';ctx.fillRect(bx2+shift+2,by2+2,cw*0.035,ch*0.025);
   ctx.fillStyle='#60a5fa';ctx.fillRect(bx2+shift+bw-cw*0.04,by2+2,cw*0.035,ch*0.025);
   if(active){ctx.strokeStyle=`rgba(250,204,21,${.55+.4*pulse})`;ctx.lineWidth=2;ctx.strokeRect(bx2+shift-2,by2-2,bw+4,bh+4);}
 }
 if(name==='Elétrica'){
   if(phase===1) drawDetachedPart(cx+cw*0.18,frontY-ch*0.03+jiggle,cw*0.12,ch*0.08,'CABO','#374151');
   if(active||diagnosed){
     ctx.strokeStyle=`rgba(96,165,250,${.45+.45*pulse})`;ctx.lineWidth=2;
     for(let i=0;i<2+(phase===3);i++){const x=cx+(-1+i)*cw*0.09;ctx.beginPath();ctx.moveTo(x,frontY-ch*0.05);ctx.lineTo(x+4,frontY-ch*0.11);ctx.lineTo(x-2,frontY-ch*0.14);ctx.stroke();}
   }
 }
 if(name==='Correia'){
   const beltW=phase===1?cw*0.18:phase===2?cw*0.14:cw*0.12;
   if(phase===1) drawDetachedPart(cx+cw*0.18,frontY-ch*0.04+jiggle,cw*0.14,ch*0.07,'COR','#111');
   ctx.strokeStyle='#111';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(cx,frontY-ch*0.025,beltW,ch*0.05,0,0,Math.PI*2);ctx.stroke();
   if(active){ctx.strokeStyle=`rgba(251,191,36,${.4+.45*pulse})`;ctx.lineWidth=2;ctx.stroke();}
 }
 if(name==='Radiador'||name==='Superaquecimento'){
   if(phase===1) drawDetachedPart(cx+cw*0.18,frontY-ch*0.04+jiggle,cw*0.16,ch*0.10,'RAD','#64748b');
   for(let i=0;i<(active?3:2);i++){
     const sx=cx+(i-1)*cw*0.08+Math.sin(tick*0.08+i)*4;
     const sy=frontY-ch*(0.13+i*0.015)-((tick+i*7)%18);
     const alpha=phase===3?(.10+.12*slow):(.16+.18*slow);
     ctx.fillStyle=name==='Superaquecimento'?`rgba(220,220,220,${alpha})`:`rgba(180,220,255,${alpha})`;
     ctx.beginPath();ctx.arc(sx,sy,5+i*1.5,0,Math.PI*2);ctx.fill();
   }
   if(name==='Superaquecimento'&&active){ctx.fillStyle=`rgba(239,68,68,${phase===3?.18:.35+.25*pulse})`;ctx.fillRect(cx-cw*0.18,frontY-ch*0.04,cw*0.36,ch*0.05);}
 }
 if(isWheel){
   const left=(playerWorkTask?.car===car?player.dir==='right':true);
   const wx=left?bx+cw*0.09:bx+cw*0.91;
   const wy=by+ch*0.76;
   if(phase===1) drawDetachedPart(wx+(left?cw*0.12:-cw*0.22),wy-ch*0.10+jiggle,cw*0.16,ch*0.14,'RODA','#181818');
   if(active||phase>0){
     ctx.fillStyle='rgba(18,18,18,.96)';ctx.beginPath();ctx.arc(wx,wy,phase===1?cw*0.07:phase===2?cw*0.095:cw*0.112,0,Math.PI*2);ctx.fill();
     ctx.strokeStyle='#71717a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(wx,wy,phase===1?cw*0.04:phase===2?cw*0.06:cw*0.07,0,Math.PI*2);ctx.stroke();
     ctx.fillStyle='#b45309';ctx.fillRect(wx-cw*0.08,wy+ch*0.10,cw*0.16,4);
     ctx.beginPath();ctx.moveTo(wx-cw*0.05,wy+ch*0.10);ctx.lineTo(wx,wy+ch*0.04);ctx.lineTo(wx+cw*0.05,wy+ch*0.10);ctx.fill();
   }
   if(name==='Freio'){
     ctx.fillStyle=`rgba(239,68,68,${phase===3?0.35:(active?0.9:0.55)})`;ctx.beginPath();ctx.arc(wx,wy,cw*0.045,0,Math.PI*2);ctx.fill();
   } else if(name==='Aquaplanagem'){
     ctx.strokeStyle=`rgba(56,189,248,${phase===3?0.22:(.45+.35*pulse)})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(wx,wy,cw*0.13,0,Math.PI);ctx.stroke();
   }
 }
 if(name==='Transmissão'){
   const gy=topY+ch*0.04;
   if(phase===1) drawDetachedPart(cx+cw*0.18,gy+jiggle,cw*0.18,ch*0.09,'TR','#3f3f46');
   const shift=phase===2?cw*0.08:0;
   ctx.fillStyle='#3f3f46';ctx.beginPath();ctx.roundRect(cx-cw*0.12+shift,gy,cw*0.24,ch*0.11,3);ctx.fill();
   ctx.strokeStyle='#a1a1aa';ctx.strokeRect(cx-cw*0.12+shift,gy,cw*0.24,ch*0.11);
   if(active){ctx.fillStyle=`rgba(167,139,250,${.35+.35*pulse})`;ctx.fillRect(cx-cw*0.16,gy+ch*0.14,cw*0.32,3);}
 }
 if(name==='Farol'){
   const lx=bx+cw*0.10,rx=bx+cw*0.90,ly=frontY+ch*0.02;
   if(phase===1) drawDetachedPart(rx+cw*0.04,ly-ch*0.12+jiggle,cw*0.14,ch*0.08,'L','#fef08a');
   const on=phase===3?tick%20<16:active?tick%12<7:tick%30<12;
   ctx.fillStyle=on?`rgba(253,224,71,${phase===3?0.35:(.65+.3*pulse)})`:'rgba(90,90,70,.55)';
   [lx,rx].forEach((x,idx)=>{if(!(phase===1&&idx===1)){ctx.beginPath();ctx.arc(x,ly,phase===2?cw*0.045:cw*0.055,0,Math.PI*2);ctx.fill();}});
 }
 if(active||finished){
   ctx.fillStyle='rgba(0,0,0,.72)';ctx.beginPath();ctx.roundRect(cx-40,by+ch+8,80,16,4);ctx.fill();
   ctx.fillStyle='#fbbf24';ctx.font="bold 11px 'VT323'";ctx.textAlign='center';
   ctx.fillText(finished?`${car.problem.emoji} CONCLUÍDO`:phaseLabel?`${car.problem.emoji} ${phaseLabel}`:`${car.problem.emoji} EM SERVIÇO`,cx,by+ch+20);
 }
 ctx.restore();
}
