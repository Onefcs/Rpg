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
  const y0=HDR_H+8+8;
  ctx.shadowColor='#FFD700'; ctx.shadowBlur=6;
  ctx.font='bold 24px sans-serif'; ctx.fillStyle='#FFD700'; ctx.textAlign='left';
  ctx.fillText('⚔ '+sc,12,y0+20);
  ctx.shadowColor='#FFF'; ctx.shadowBlur=3;
  ctx.font='bold 13px sans-serif'; ctx.fillStyle='#FFF'; ctx.textAlign='right';
  ctx.fillText('Волна '+wave,VW-10,y0+12);
  ctx.shadowBlur=0;
  ctx.font='10px sans-serif'; ctx.fillStyle='rgba(255,255,255,0.55)';
  ctx.fillText('×'+(gspd/3.5).toFixed(1)+' скор.',VW-10,y0+26);
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

// ─── HEADER ──────────────────────────────────────────────────────────────────
function drawHeader(){
  const isPlay=ST==='PLAY'&&pl;
  const cfg=isPlay?pl.cfg:CHAR[selC];
  const curHp=isPlay?pl.hp:cfg.hp;
  const maxHp=isPlay?pl.mhp:cfg.hp;

  // Panel background
  const hg=ctx.createLinearGradient(0,0,0,HDR_H+8);
  hg.addColorStop(0,'rgba(4,4,20,0.97)'); hg.addColorStop(1,'rgba(4,4,20,0.78)');
  ctx.fillStyle=hg; ctx.fillRect(0,0,VW,HDR_H+8);
  ctx.fillStyle=cfg.c+'55'; ctx.fillRect(0,HDR_H-1,VW,2);

  // Level badge (left)
  ctx.save();
  rR(10,9,44,22,5); ctx.fillStyle=cfg.c+'33'; ctx.fill();
  ctx.strokeStyle=cfg.c+'66'; ctx.lineWidth=1; ctx.stroke();
  ctx.fillStyle=cfg.c; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
  ctx.fillText('Lv.'+plLv,32,24);
  ctx.restore();
  ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.font='bold 12px sans-serif'; ctx.textAlign='left';
  ctx.fillText(cfg.n,10,46);

  // Gold (right)
  ctx.shadowColor='#FFD700'; ctx.shadowBlur=8;
  ctx.fillStyle='#FFD700'; ctx.font='bold 14px sans-serif'; ctx.textAlign='right';
  ctx.fillText('💰 '+gold,VW-10,26);
  ctx.shadowBlur=0;

  // HP hearts (centre)
  const show=Math.min(maxHp,8), hs=16, hsp=19;
  const htot=show*hsp, hx0=(VW-htot)/2;
  for(let i=0;i<show;i++) heart(hx0+i*hsp+hs/2,42,hs,i<curHp);
  if(maxHp>8){
    ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.font='9px sans-serif'; ctx.textAlign='left';
    ctx.fillText('+'+( maxHp-8),hx0+show*hsp+2,46);
  }
  ctx.fillStyle='rgba(255,255,255,0.30)'; ctx.font='8px sans-serif'; ctx.textAlign='right';
  ctx.fillText('HP',hx0-4,46);

  // XP bar (strip below panel)
  const xpPrev=XP_TO_LV[plLv-1]||0;
  const xpNext=XP_TO_LV[plLv]||XP_TO_LV[XP_TO_LV.length-1];
  const xpPct=xpNext>xpPrev?Math.min((xp-xpPrev)/(xpNext-xpPrev),1):1;
  ctx.fillStyle='rgba(255,255,255,0.06)'; ctx.fillRect(0,HDR_H,VW,8);
  const xg=ctx.createLinearGradient(0,0,VW,0);
  xg.addColorStop(0,cfg.c+'70'); xg.addColorStop(1,cfg.c);
  ctx.fillStyle=xg; ctx.fillRect(0,HDR_H,VW*xpPct,8);
  ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.font='7px sans-serif'; ctx.textAlign='right';
  ctx.fillText('XP '+(xp-xpPrev)+'/'+(xpNext-xpPrev),VW-3,HDR_H+7);
}

// ─── NAVIGATION BAR ──────────────────────────────────────────────────────────
function drawNav(){
  const cfg=(ST==='PLAY'&&pl)?pl.cfg:CHAR[selC];
  const ng=ctx.createLinearGradient(0,VH-NAV_H,0,VH);
  ng.addColorStop(0,'rgba(4,4,20,0.82)'); ng.addColorStop(1,'rgba(4,4,20,0.97)');
  ctx.fillStyle=ng; ctx.fillRect(0,VH-NAV_H,VW,NAV_H);
  ctx.fillStyle='rgba(255,255,255,0.07)'; ctx.fillRect(0,VH-NAV_H,VW,1);

  const tabW=VW/NAV_TABS.length;
  NAV_TABS.forEach((tab,i)=>{
    const x=i*tabW, cx=x+tabW/2, active=navTab===tab;
    if(active){
      ctx.fillStyle=cfg.c+'1E'; ctx.fillRect(x,VH-NAV_H,tabW,NAV_H);
      ctx.fillStyle=cfg.c; ctx.fillRect(x+6,VH-NAV_H,tabW-12,2);
    }
    ctx.font='20px sans-serif'; ctx.textAlign='center';
    ctx.fillStyle=active?cfg.c:'rgba(255,255,255,0.38)';
    ctx.fillText(NAV_ICONS[i],cx,VH-NAV_H+28);
    ctx.font=(active?'bold ':'')+' 9px sans-serif';
    ctx.fillStyle=active?'#FFF':'rgba(255,255,255,0.32)';
    ctx.fillText(NAV_LABELS[i],cx,VH-NAV_H+46);
  });
}

// ─── TAB SCREENS ─────────────────────────────────────────────────────────────
function drawTabScreen(tab){
  ctx.fillStyle='rgba(4,4,20,0.88)';
  ctx.fillRect(0,HDR_H+8,VW,VH-HDR_H-8-NAV_H);
  if(tab==='inventory') drawInventoryTab();
  else if(tab==='friends')   drawFriendsTab();
  else if(tab==='quests')    drawQuestsTab();
  else if(tab==='profile')   drawProfileTab();
}

function tabTitle(text){
  ctx.fillStyle='rgba(255,255,255,0.05)'; ctx.fillRect(0,HDR_H+8,VW,44);
  ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.fillRect(0,HDR_H+52,VW,1);
  ctx.fillStyle='#FFF'; ctx.font='bold 17px sans-serif'; ctx.textAlign='center';
  ctx.fillText(text,VW/2,HDR_H+36);
}

function drawInventoryTab(){
  tabTitle('ИНВЕНТАРЬ');
  const c=(ST==='PLAY'&&pl)?pl.char:selC;
  const cfg=CHAR[c];
  const ad=imgs.ch[c].idle;
  const fw=ad.w/ad.f, spSx=ad.tx||0, spSy=ad.ty||0;
  const spSw=ad.tw||fw, spSh=ad.th||ad.h;
  const sc2=2.8, dh=spSh*sc2, dw=spSw*sc2, baseY=HDR_H+68;
  ctx.save(); ctx.shadowColor=cfg.c; ctx.shadowBlur=18;
  ctx.drawImage(ad.im,spSx,spSy,spSw,spSh, VW*0.24-dw/2, baseY, dw, dh);
  ctx.restore();

  const slots=[
    {icon:'⚔',label:'Оружие',item:'Деревянный меч'},
    {icon:'🛡',label:'Броня',  item:null},
    {icon:'⛑',label:'Шлем',   item:null},
    {icon:'👟',label:'Сапоги', item:null},
  ];
  const sx=VW*0.50, sy=HDR_H+68, sg=62;
  slots.forEach((slot,i)=>{
    const ty=sy+i*sg;
    rR(sx,ty,VW-sx-12,50,6);
    ctx.fillStyle='rgba(255,255,255,0.05)'; ctx.fill();
    ctx.strokeStyle=slot.item?cfg.c+'77':'rgba(255,255,255,0.10)';
    ctx.lineWidth=1; ctx.stroke();
    ctx.font='16px sans-serif'; ctx.textAlign='left';
    ctx.fillText(slot.icon,sx+8,ty+30);
    ctx.fillStyle='rgba(255,255,255,0.40)'; ctx.font='8px sans-serif';
    ctx.fillText(slot.label,sx+28,ty+14);
    ctx.fillStyle=slot.item?'#EEE':'rgba(255,255,255,0.18)';
    ctx.font=slot.item?'bold 11px sans-serif':'10px sans-serif';
    ctx.fillText(slot.item||'пусто',sx+28,ty+30);
  });
}

function drawFriendsTab(){
  tabTitle('ДРУЗЬЯ');
  const y=HDR_H+80;
  ctx.font='44px sans-serif'; ctx.textAlign='center';
  ctx.fillText('👥',VW/2,y+44);
  ctx.fillStyle='rgba(255,255,255,0.60)'; ctx.font='bold 15px sans-serif';
  ctx.fillText('Список друзей пуст',VW/2,y+96);
  ctx.fillStyle='rgba(255,255,255,0.32)'; ctx.font='12px sans-serif';
  ctx.fillText('Пригласите друзей и сражайтесь вместе!',VW/2,y+120);
  const bw=210, bh=44, bx=(VW-bw)/2, by=y+152;
  rR(bx,by,bw,bh,8);
  const bg=ctx.createLinearGradient(bx,0,bx+bw,0);
  bg.addColorStop(0,'#3498DB66'); bg.addColorStop(1,'#2980B966');
  ctx.fillStyle=bg; ctx.fill();
  ctx.strokeStyle='#3498DB88'; ctx.lineWidth=1; ctx.stroke();
  ctx.fillStyle='#FFF'; ctx.font='bold 13px sans-serif'; ctx.textAlign='center';
  ctx.fillText('+ Пригласить',VW/2,by+28);
}

function drawQuestsTab(){
  tabTitle('ЗАДАНИЯ');
  const cfg=(ST==='PLAY'&&pl)?pl.cfg:CHAR[selC];
  const qs=[
    {label:'Убить 10 врагов',   cur:Math.min(totalKills,10),  tgt:10,  rwd:'💰 50'},
    {label:'Убить 50 врагов',   cur:Math.min(totalKills,50),  tgt:50,  rwd:'💰 200'},
    {label:'Достичь волны 5',   cur:Math.min(bestWave,5),     tgt:5,   rwd:'⭐ 100 XP'},
    {label:'Достичь волны 15',  cur:Math.min(bestWave,15),    tgt:15,  rwd:'⭐ 300 XP'},
    {label:'Набрать 500 очков', cur:Math.min(bestScore,500),  tgt:500, rwd:'💰 150'},
  ];
  const qy=HDR_H+60, qh=64, qg=8;
  qs.forEach((q,i)=>{
    const ty=qy+i*(qh+qg);
    const done=q.cur>=q.tgt;
    rR(12,ty,VW-24,qh,7);
    ctx.fillStyle=done?cfg.c+'22':'rgba(255,255,255,0.04)'; ctx.fill();
    ctx.strokeStyle=done?cfg.c+'55':'rgba(255,255,255,0.08)'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle=done?'#FFF':'rgba(255,255,255,0.72)';
    ctx.font=(done?'bold ':'')+' 12px sans-serif'; ctx.textAlign='left';
    ctx.fillText(q.label,22,ty+18);
    ctx.fillStyle='rgba(255,200,0,0.85)'; ctx.font='10px sans-serif'; ctx.textAlign='right';
    ctx.fillText(q.rwd,VW-22,ty+18);
    const bx=22, bw=VW-100, barH=4;
    ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.fillRect(bx,ty+28,bw,barH);
    const pg=ctx.createLinearGradient(bx,0,bx+bw,0);
    pg.addColorStop(0,cfg.c+'88'); pg.addColorStop(1,cfg.c+(done?'FF':'CC'));
    ctx.fillStyle=pg; ctx.fillRect(bx,ty+28,bw*Math.min(q.cur/q.tgt,1),barH);
    ctx.fillStyle='rgba(255,255,255,0.38)'; ctx.font='10px sans-serif'; ctx.textAlign='left';
    ctx.fillText(q.cur+'/'+q.tgt,bx,ty+52);
    if(done){
      rR(VW-78,ty+22,64,22,5); ctx.fillStyle=cfg.c; ctx.fill();
      ctx.fillStyle='#FFF'; ctx.font='bold 10px sans-serif'; ctx.textAlign='center';
      ctx.fillText('✓ Готово',VW-46,ty+36);
    }
  });
}

function drawProfileTab(){
  tabTitle('ПРОФИЛЬ');
  const c=(ST==='PLAY'&&pl)?pl.char:selC;
  const cfg=CHAR[c];
  const ad=imgs.ch[c].idle;
  const fw=ad.w/ad.f, spSx=ad.tx||0, spSy=ad.ty||0;
  const spSw=ad.tw||fw, spSh=ad.th||ad.h;
  const sc2=3.0, dh=spSh*sc2, dw=spSw*sc2;
  ctx.save(); ctx.shadowColor=cfg.c; ctx.shadowBlur=26;
  ctx.drawImage(ad.im,spSx,spSy,spSw,spSh, VW/2-dw/2, HDR_H+62, dw, dh);
  ctx.restore();
  const ny=HDR_H+62+dh+16;
  ctx.fillStyle='#FFF'; ctx.font='bold 16px sans-serif'; ctx.textAlign='center';
  ctx.fillText(cfg.n,VW/2,ny);
  ctx.fillStyle=cfg.c; ctx.font='10px sans-serif';
  ctx.fillText('Уровень '+plLv,VW/2,ny+16);
  const stats=[
    {label:'Убито',  val:totalKills},
    {label:'Рекорд', val:bestScore},
    {label:'Волна',  val:bestWave},
    {label:'Игр',    val:gamesPlayed},
    {label:'Золото', val:gold},
    {label:'Опыт',   val:xp},
  ];
  const cols=3, sw=VW/cols-14, sh=52, sx=7, sy=ny+28;
  stats.forEach((st,i)=>{
    const col=i%cols, row=Math.floor(i/cols);
    const tx=sx+col*(sw+7), ty=sy+row*(sh+7);
    rR(tx,ty,sw,sh,6);
    ctx.fillStyle='rgba(255,255,255,0.05)'; ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle=cfg.c; ctx.font='bold 18px sans-serif'; ctx.textAlign='center';
    ctx.fillText(st.val,tx+sw/2,ty+28);
    ctx.fillStyle='rgba(255,255,255,0.38)'; ctx.font='9px sans-serif';
    ctx.fillText(st.label,tx+sw/2,ty+44);
  });
}
