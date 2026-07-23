function drawGame(){
  drawBG();
  ctx.fillStyle='rgba(0,0,0,0.18)'; ctx.fillRect(0,GY,VW,22);
  en.filter(e=>e.x>PX-10).forEach(drawEnemy);
  drawPlayer();
  pt.forEach(drawPart);
  drawHUD();
}

function drawBG(){
  const bk=BGS[curBG];
  LAYERS.forEach((layer,i)=>{
    const im=imgs.bg[bk][layer];
    if(!im||!im.complete) return;
    const off=bgO[i];
    ctx.drawImage(im,-off,0,VW,VH);
    if(off>0) ctx.drawImage(im,VW-off,0,VW,VH);
  });
}

function drawPlayer(){
  const ad=imgs.ch[pl.char][pl.state];
  if(!ad||!ad.im.complete) return;
  const cfg=CHAR[pl.char];
  const fw=ad.w/ad.f, fh=ad.h;
  const dh=fh*cfg.sc, dw=fw*cfg.sc;
  if(pl.ht>0&&Math.floor(pl.ht/65)%2===0){
    ctx.save();
    ctx.globalAlpha=0.3;
    ctx.drawImage(ad.im,pl.fr*fw,0,fw,fh,PX-dw*0.3,GY-dh,dw,dh);
    ctx.globalAlpha=1;
    ctx.fillStyle='rgba(255,0,0,0.25)'; ctx.fillRect(PX-dw*0.3,GY-dh,dw,dh);
    ctx.restore();
  }else{
    ctx.drawImage(ad.im,pl.fr*fw,0,fw,fh,PX-dw*0.3,GY-dh,dw,dh);
  }
}

function drawEnemy(e){
  const et=ET[e.tp];
  const bh=VH*0.155, h=bh*e.s, w=h*0.68, cx=e.x;
  const dead=e.hp<=0, al=dead?Math.max(0,1-(e.dt||0)/600):1;
  const bob=dead?0:Math.sin(Date.now()/180+e.x*0.05)*2.5;
  ctx.save(); ctx.globalAlpha=al;
  ctx.fillStyle='rgba(0,0,0,0.20)';
  ctx.beginPath(); ctx.ellipse(cx,GY+4,w*0.5,6,0,0,Math.PI*2); ctx.fill();
  const bc=dead?'#555':et.c;
  ctx.fillStyle=bc;
  ctx.fillRect(cx-w*0.24,GY-h*0.36+bob,w*0.19,h*0.36);
  ctx.fillRect(cx+w*0.05,GY-h*0.36+bob,w*0.19,h*0.36);
  ctx.beginPath(); ctx.ellipse(cx,GY-h*0.62+bob,w*0.40,h*0.30,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=bc;
  ctx.save(); ctx.translate(cx,GY-h*0.62+bob);
  const armSwing=dead?0:Math.sin(Date.now()/160+e.x*0.05)*0.5;
  ctx.rotate(armSwing);
  ctx.fillRect(-w*0.62,-h*0.08,w*0.20,h*0.30);
  ctx.rotate(-armSwing*2);
  ctx.fillRect(w*0.42,-h*0.08,w*0.20,h*0.30);
  ctx.restore();
  const hR=h*0.22;
  ctx.fillStyle=bc;
  ctx.beginPath(); ctx.arc(cx,GY-h*0.94+bob,hR,0,Math.PI*2); ctx.fill();
  if(!dead){
    ctx.fillStyle=et.e;
    ctx.beginPath();
    ctx.arc(cx-hR*0.38,GY-h*0.97+bob,hR*0.22,0,Math.PI*2);
    ctx.arc(cx+hR*0.38,GY-h*0.97+bob,hR*0.22,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#000';
    ctx.beginPath();
    ctx.arc(cx-hR*0.30,GY-h*0.94+bob,hR*0.12,0,Math.PI*2);
    ctx.arc(cx+hR*0.46,GY-h*0.94+bob,hR*0.12,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#FFF'; ctx.lineWidth=hR*0.14;
    ctx.beginPath(); ctx.arc(cx,GY-h*0.84+bob,hR*0.32,0.25,Math.PI-0.25); ctx.stroke();
    const bw=w*1.1, bh2=6, bx=cx-bw/2, by=GY-h-hR*2.4+bob-bh2;
    ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(bx-1,by-1,bw+2,bh2+2);
    ctx.fillStyle='#333'; ctx.fillRect(bx,by,bw,bh2);
    const hp=e.hp/e.mhp;
    ctx.fillStyle=hp>0.6?'#2ECC71':hp>0.3?'#F39C12':'#E74C3C';
    ctx.fillRect(bx,by,bw*hp,bh2);
    ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.font=`${8+h*0.04}px sans-serif`; ctx.textAlign='center';
    ctx.fillText(et.n+' '+e.hp+'/'+e.mhp,cx,by-3);
  }
  ctx.restore();
}

function drawPart(p){
  ctx.save(); ctx.globalAlpha=p.l;
  if(p.tp==='tx'){
    ctx.font=`bold ${p.sz}px sans-serif`; ctx.textAlign='center';
    ctx.fillStyle=p.col; ctx.shadowColor=p.col; ctx.shadowBlur=7;
    ctx.fillText(p.txt,p.x,p.y);
  }else if(p.tp==='sp'){
    ctx.fillStyle=p.col; ctx.beginPath(); ctx.arc(p.x,p.y,p.sz,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

function drawHUD(){
  ctx.fillStyle='rgba(0,0,0,0.35)'; ctx.fillRect(0,0,VW,46);
  ctx.shadowColor='#000'; ctx.shadowBlur=4;
  ctx.font='bold 26px sans-serif'; ctx.fillStyle='#FFD700'; ctx.textAlign='left';
  ctx.fillText('⚔ '+sc,12,32);
  ctx.font='bold 16px sans-serif'; ctx.fillStyle='#FFF'; ctx.textAlign='right';
  ctx.fillText('Волна '+wave,VW-12,24);
  ctx.font='12px sans-serif'; ctx.fillStyle='#AAA';
  ctx.fillText('×'+(gspd/3.5).toFixed(1)+' скор.',VW-12,42);
  ctx.shadowBlur=0;
  const hs=Math.min(22,(VW/2)/(pl.mhp+1));
  const htot=pl.mhp*(hs+3)-3, hx=(VW-htot)/2, hy=VH-24;
  for(let i=0;i<pl.mhp;i++) heart(hx+i*(hs+3)+hs/2,hy,hs,i<pl.hp);
  ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.font='12px sans-serif'; ctx.textAlign='left';
  ctx.fillText(CHAR[pl.char].n,6,VH-8);
}

function heart(cx,cy,s,filled){
  ctx.save(); ctx.fillStyle=filled?'#E74C3C':'rgba(180,30,30,0.2)';
  ctx.shadowColor=filled?'#E74C3C':'transparent'; ctx.shadowBlur=filled?8:0;
  const r=s/2;
  ctx.beginPath();
  ctx.moveTo(cx,cy+r*0.55);
  ctx.bezierCurveTo(cx,cy,cx-r,cy,cx-r,cy-r*0.28);
  ctx.bezierCurveTo(cx-r,cy-r,cx,cy-r,cx,cy-r*0.28);
  ctx.bezierCurveTo(cx,cy-r,cx+r,cy-r,cx+r,cy-r*0.28);
  ctx.bezierCurveTo(cx+r,cy,cx,cy,cx,cy+r*0.55);
  ctx.fill(); ctx.restore();
}

function drawOver(dt){
  goT+=dt; drawBG();
  ctx.fillStyle='rgba(0,0,0,0.72)'; ctx.fillRect(0,0,VW,VH);
  const p=Math.sin(goT/380)*6;
  ctx.save(); ctx.textAlign='center';
  ctx.shadowBlur=26+p; ctx.shadowColor='#E74C3C';
  ctx.font=`bold ${56+p*0.15}px sans-serif`; ctx.fillStyle='#E74C3C';
  ctx.fillText('GAME OVER',VW/2,VH*0.34);
  ctx.font='bold 36px sans-serif'; ctx.fillStyle='#FFD700'; ctx.shadowColor='#FFD700';
  ctx.fillText('Счёт: '+sc,VW/2,VH*0.50);
  ctx.font='18px sans-serif'; ctx.fillStyle='#FFF'; ctx.shadowBlur=0;
  ctx.fillText('Нажмите для выбора персонажа',VW/2,VH*0.64);
  ctx.restore();
}
