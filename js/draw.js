function drawGame(){
  drawBG();
  // Ground shadow strip with gradient
  const gg=ctx.createLinearGradient(0,GY,0,GY+28);
  gg.addColorStop(0,'rgba(0,0,0,0.30)'); gg.addColorStop(1,'transparent');
  ctx.fillStyle=gg; ctx.fillRect(0,GY,VW,28);
  en.filter(e=>e.x>PX-10).forEach(drawEnemy);
  drawPlayer();
  pt.forEach(drawPart);
  drawHUD();
}

function drawBG(){
  BG_FN[BGS[curBG]](bgO);
}

function drawPlayer(){
  const ad=imgs.ch[pl.char][pl.state];
  if(!ad||!ad.im.complete) return;
  const cfg=CHAR[pl.char];
  const fw=ad.w/ad.f;
  const sx=pl.fr*fw+(ad.tx||0), sy=ad.ty||0;
  const sw=ad.tw||fw, sh=ad.th||ad.h;
  const dh=sh*cfg.sc, dw=sw*cfg.sc;
  const dx=PX-dw*0.5, dy=GY-dh;

  // Ground shadow ellipse
  ctx.save(); ctx.globalAlpha=0.28;
  ctx.fillStyle='#000';
  ctx.beginPath(); ctx.ellipse(PX,GY+3,dw*0.48,5,0,0,Math.PI*2); ctx.fill();
  ctx.restore();

  if(pl.ht>0&&Math.floor(pl.ht/65)%2===0){
    ctx.save();
    ctx.globalAlpha=0.35;
    ctx.drawImage(ad.im,sx,sy,sw,sh,dx,dy,dw,dh);
    ctx.globalAlpha=1;
    ctx.fillStyle='rgba(255,60,60,0.28)'; ctx.fillRect(dx,dy,dw,dh);
    ctx.restore();
  }else{
    ctx.save();
    ctx.shadowColor=cfg.c; ctx.shadowBlur=10;
    ctx.drawImage(ad.im,sx,sy,sw,sh,dx,dy,dw,dh);
    ctx.restore();
  }
}

function drawEnemy(e){
  const et=ET[e.tp];
  const bh=84, h=bh*e.s, w=h*0.68, cx=e.x;
  const dead=e.hp<=0, al=dead?Math.max(0,1-(e.dt||0)/600):1;
  const bob=dead?0:Math.sin(Date.now()/180+e.x*0.05)*2.5;
  ctx.save(); ctx.globalAlpha=al;

  // Ground shadow
  ctx.fillStyle='rgba(0,0,0,0.22)';
  ctx.beginPath(); ctx.ellipse(cx,GY+4,w*0.50,5,0,0,Math.PI*2); ctx.fill();

  const bc=dead?'#555':et.c;

  // Body gradient
  const bg=ctx.createLinearGradient(cx-w*0.3,GY-h,cx+w*0.3,GY);
  bg.addColorStop(0,dead?'#666':et.e); bg.addColorStop(1,bc);
  ctx.fillStyle=bg;

  // Legs
  ctx.fillStyle=bc;
  ctx.fillRect(cx-w*0.24,GY-h*0.36+bob,w*0.19,h*0.36);
  ctx.fillRect(cx+w*0.05,GY-h*0.36+bob,w*0.19,h*0.36);

  // Body
  ctx.fillStyle=bg;
  ctx.beginPath(); ctx.ellipse(cx,GY-h*0.62+bob,w*0.40,h*0.30,0,0,Math.PI*2); ctx.fill();

  // Arms
  ctx.fillStyle=bc;
  ctx.save(); ctx.translate(cx,GY-h*0.62+bob);
  const armSwing=dead?0:Math.sin(Date.now()/160+e.x*0.05)*0.5;
  ctx.rotate(armSwing);
  ctx.fillRect(-w*0.62,-h*0.08,w*0.20,h*0.30);
  ctx.rotate(-armSwing*2);
  ctx.fillRect(w*0.42,-h*0.08,w*0.20,h*0.30);
  ctx.restore();

  // Head
  const hR=h*0.22;
  ctx.fillStyle=bc;
  ctx.beginPath(); ctx.arc(cx,GY-h*0.94+bob,hR,0,Math.PI*2); ctx.fill();

  if(!dead){
    // Eyes
    ctx.fillStyle=et.e;
    ctx.beginPath();
    ctx.arc(cx-hR*0.38,GY-h*0.97+bob,hR*0.22,0,Math.PI*2);
    ctx.arc(cx+hR*0.38,GY-h*0.97+bob,hR*0.22,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#000';
    ctx.beginPath();
    ctx.arc(cx-hR*0.30,GY-h*0.94+bob,hR*0.12,0,Math.PI*2);
    ctx.arc(cx+hR*0.46,GY-h*0.94+bob,hR*0.12,0,Math.PI*2); ctx.fill();
    // Mouth
    ctx.strokeStyle='#FFF'; ctx.lineWidth=hR*0.14;
    ctx.beginPath(); ctx.arc(cx,GY-h*0.84+bob,hR*0.32,0.25,Math.PI-0.25); ctx.stroke();

    // HP bar
    const bw=w*1.1, bh2=5, bx=cx-bw/2, by=GY-h-hR*2.5+bob-bh2;
    ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.fillRect(bx-1,by-1,bw+2,bh2+2);
    const hp=e.hp/e.mhp;
    const hc=hp>0.6?'#2ECC71':hp>0.3?'#F39C12':'#E74C3C';
    const hg=ctx.createLinearGradient(bx,0,bx+bw,0);
    hg.addColorStop(0,hc+'AA'); hg.addColorStop(1,hc);
    ctx.fillStyle='#1A1A1A'; ctx.fillRect(bx,by,bw,bh2);
    ctx.fillStyle=hg; ctx.fillRect(bx,by,bw*hp,bh2);
    // Name
    ctx.fillStyle='rgba(255,255,255,0.75)'; ctx.font=`${8+h*0.04}px sans-serif`; ctx.textAlign='center';
    ctx.fillText(et.n+' '+e.hp+'/'+e.mhp,cx,by-3);
  }
  ctx.restore();
}

function drawPart(p){
  ctx.save(); ctx.globalAlpha=p.l;
  if(p.tp==='tx'){
    ctx.font=`bold ${p.sz}px sans-serif`; ctx.textAlign='center';
    ctx.fillStyle=p.col; ctx.shadowColor=p.col; ctx.shadowBlur=10;
    ctx.fillText(p.txt,p.x,p.y);
  }else if(p.tp==='sp'){
    ctx.fillStyle=p.col; ctx.shadowColor=p.col; ctx.shadowBlur=4;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.sz,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

function drawHUD(){
  // Top bar
  const tg=ctx.createLinearGradient(0,0,0,52);
  tg.addColorStop(0,'rgba(0,0,0,0.70)'); tg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=tg; ctx.fillRect(0,0,VW,52);

  // Score
  ctx.shadowColor='#FFD700'; ctx.shadowBlur=8;
  ctx.font='bold 28px sans-serif'; ctx.fillStyle='#FFD700'; ctx.textAlign='left';
  ctx.fillText('⚔ '+sc,12,34);

  // Wave badge
  ctx.shadowColor='#FFF'; ctx.shadowBlur=4;
  ctx.font='bold 15px sans-serif'; ctx.fillStyle='#FFF'; ctx.textAlign='right';
  ctx.fillText('Волна '+wave,VW-10,22);
  ctx.shadowBlur=0;
  ctx.font='11px sans-serif'; ctx.fillStyle='rgba(255,255,255,0.55)';
  ctx.fillText('×'+(gspd/3.5).toFixed(1)+' скор.',VW-10,38);

  // Bottom: character name + hearts
  const cfg=CHAR[pl.char];
  const bg2=ctx.createLinearGradient(0,VH-52,0,VH);
  bg2.addColorStop(0,'rgba(0,0,0,0)'); bg2.addColorStop(1,'rgba(0,0,0,0.65)');
  ctx.fillStyle=bg2; ctx.fillRect(0,VH-52,VW,52);

  ctx.fillStyle=cfg.c; ctx.font='bold 11px sans-serif'; ctx.textAlign='left';
  ctx.fillText(cfg.n.toUpperCase(),10,VH-32);

  const hs=Math.min(20,(VW*0.55)/(pl.mhp+1));
  const htot=pl.mhp*(hs+3)-3, hx=VW-10-htot, hy=VH-20;
  for(let i=0;i<pl.mhp;i++) heart(hx+i*(hs+3)+hs/2,hy,hs,i<pl.hp);
}

function heart(cx,cy,s,filled){
  ctx.save(); ctx.fillStyle=filled?'#E74C3C':'rgba(180,30,30,0.18)';
  ctx.shadowColor=filled?'#E74C3C':'transparent'; ctx.shadowBlur=filled?7:0;
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
  const ov=ctx.createLinearGradient(0,0,0,VH);
  ov.addColorStop(0,'rgba(0,0,0,0.85)'); ov.addColorStop(1,'rgba(20,0,0,0.80)');
  ctx.fillStyle=ov; ctx.fillRect(0,0,VW,VH);
  const p=Math.sin(goT/380)*5;
  ctx.save(); ctx.textAlign='center';
  ctx.shadowBlur=28+p; ctx.shadowColor='#E74C3C';
  ctx.font=`bold ${52+p*0.1}px sans-serif`; ctx.fillStyle='#E74C3C';
  ctx.fillText('GAME OVER',VW/2,VH*0.36);
  ctx.shadowBlur=12; ctx.shadowColor='#FFD700';
  ctx.font='bold 34px sans-serif'; ctx.fillStyle='#FFD700';
  ctx.fillText('Счёт: '+sc,VW/2,VH*0.50);
  ctx.shadowBlur=0;
  ctx.font='16px sans-serif'; ctx.fillStyle='rgba(255,255,255,0.70)';
  ctx.fillText('Нажмите для выбора персонажа',VW/2,VH*0.64);
  ctx.restore();
}
