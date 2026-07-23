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
  const y0=HDR_H+14;
  // Score pill (left)
  const scTxt='⚔  '+sc;
  ctx.font='bold 20px sans-serif'; ctx.textAlign='left';
  const scW=ctx.measureText(scTxt).width+20;
  rR(10,y0,scW,30,15); ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.fill();
  ctx.fillStyle='#F39C12'; ctx.fillText(scTxt,20,y0+22);
  // Wave pill (right)
  const wvTxt='Волна '+wave;
  ctx.font='bold 13px sans-serif'; ctx.textAlign='right';
  const wvW=ctx.measureText(wvTxt).width+20;
  rR(VW-10-wvW,y0,wvW,30,15); ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.fill();
  ctx.fillStyle='#FFFFFF'; ctx.fillText(wvTxt,VW-10,y0+22);
  // Speed tag
  ctx.font='11px sans-serif'; ctx.fillStyle='rgba(255,255,255,0.50)';
  ctx.fillText('×'+(gspd/3.5).toFixed(1),VW-10,y0+40);
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
  ctx.fillStyle='rgba(8,8,20,0.82)'; ctx.fillRect(0,0,VW,VH);
  ctx.save(); ctx.textAlign='center';
  // GAME OVER
  ctx.font='bold 54px sans-serif'; ctx.fillStyle='#E74C3C';
  ctx.fillText('GAME OVER',VW/2,VH*0.35);
  // Score card
  const sy=VH*0.46, sw2=VW*0.60, sh2=72, sx2=(VW-sw2)/2;
  rR(sx2,sy,sw2,sh2,12); ctx.fillStyle='rgba(255,255,255,0.06)'; ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.12)'; ctx.lineWidth=1; ctx.stroke();
  ctx.font='13px sans-serif'; ctx.fillStyle='rgba(255,255,255,0.50)';
  ctx.fillText('РЕЗУЛЬТАТ',VW/2,sy+20);
  ctx.font='bold 36px sans-serif'; ctx.fillStyle='#F39C12';
  ctx.fillText(sc,VW/2,sy+56);
  // Tap prompt
  const pulse=0.55+0.45*Math.sin(goT/400);
  ctx.globalAlpha=pulse;
  ctx.font='bold 14px sans-serif'; ctx.fillStyle='#FFFFFF';
  ctx.fillText('Нажмите, чтобы продолжить',VW/2,VH*0.67);
  ctx.globalAlpha=1;
  ctx.restore();
}

// ─── HEADER ──────────────────────────────────────────────────────────────────
function drawHeader(){
  const isPlay=ST==='PLAY'&&pl;
  const cfg=isPlay?pl.cfg:CHAR[selC];
  const c=isPlay?pl.char:selC;
  const curHp=isPlay?pl.hp:cfg.hp;
  const maxHp=isPlay?pl.mhp:cfg.hp;

  // Panel
  ctx.fillStyle='#0F1120'; ctx.fillRect(0,0,VW,HDR_H);
  const ag=ctx.createLinearGradient(0,0,0,HDR_H);
  ag.addColorStop(0,cfg.c); ag.addColorStop(1,cfg.c+'33');
  ctx.fillStyle=ag; ctx.fillRect(0,0,3,HDR_H);
  ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.fillRect(0,HDR_H-1,VW,1);

  // Avatar (r=17, center at 27,27)
  const avR=17, avX=27, avY=27;
  ctx.fillStyle=cfg.c+'1E';
  ctx.beginPath(); ctx.arc(avX,avY,avR,0,Math.PI*2); ctx.fill();
  const ad=imgs.ch[c].idle;
  const fw=ad.w/ad.f, spSx=ad.tx||0, spSy=ad.ty||0;
  const spSw=ad.tw||fw, spSh=ad.th||ad.h;
  ctx.save();
  ctx.beginPath(); ctx.arc(avX,avY,avR-1,0,Math.PI*2); ctx.clip();
  const avSc=avR*2*0.88/Math.max(spSw,spSh);
  ctx.drawImage(ad.im,spSx,spSy,spSw,spSh, avX-spSw*avSc/2, avY-spSh*avSc*0.54, spSw*avSc, spSh*avSc);
  ctx.restore();
  ctx.strokeStyle=cfg.c; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.arc(avX,avY,avR,0,Math.PI*2); ctx.stroke();

  // Name + class row
  const nx=avX+avR+10;
  ctx.fillStyle='#FFFFFF'; ctx.font='bold 13px sans-serif'; ctx.textAlign='left';
  ctx.fillText(cfg.n, nx, avY-5);
  ctx.font='10px sans-serif'; ctx.fillStyle='rgba(255,255,255,0.42)';
  ctx.fillText(cfg.cl+'  ⚔ '+(isPlay?sc:0)+'  💰 '+gold, nx, avY+9);

  // Level pill (top-right)
  ctx.font='bold 10px sans-serif';
  const lvTxt='Ур.'+plLv;
  const lvW=ctx.measureText(lvTxt).width+12;
  const lvX=VW-8-lvW, lvY0=5, lvH=18;
  rR(lvX,lvY0,lvW,lvH,5);
  ctx.fillStyle='rgba(243,156,18,0.18)'; ctx.fill();
  ctx.strokeStyle='#F39C1299'; ctx.lineWidth=1; ctx.stroke();
  ctx.fillStyle='#F39C12'; ctx.textAlign='center';
  ctx.fillText(lvTxt, lvX+lvW/2, lvY0+13);

  // HP bar (y=44, h=9)
  const bx=8, bw=VW-16, hpY=44, hpH=9;
  const hpPct=Math.max(0,Math.min(curHp/maxHp,1));
  rR(bx,hpY,bw,hpH,hpH/2); ctx.fillStyle='rgba(255,255,255,0.07)'; ctx.fill();
  if(hpPct>0){
    const hw=Math.max(bw*hpPct,hpH);
    const hg=ctx.createLinearGradient(bx,0,bx+bw,0);
    hg.addColorStop(0,'#B03020'); hg.addColorStop(1,'#E74C3C');
    rR(bx,hpY,hw,hpH,hpH/2); ctx.fillStyle=hg; ctx.fill();
  }
  ctx.font='bold 9px sans-serif'; ctx.fillStyle='rgba(255,255,255,0.85)';
  ctx.textAlign='left';  ctx.fillText('HP', bx+5, hpY+hpH-1);
  ctx.textAlign='right'; ctx.fillText(curHp+'/'+maxHp, bx+bw-5, hpY+hpH-1);

  // XP bar (y=55, h=6 → bottom=61)
  const xpPrev=XP_TO_LV[plLv-1]||0;
  const xpNext=XP_TO_LV[plLv]||XP_TO_LV[XP_TO_LV.length-1];
  const xpCur=Math.max(0,xp-xpPrev), xpRange=Math.max(1,xpNext-xpPrev);
  const xpY=hpY+hpH+2, xpH=6;
  rR(bx,xpY,bw,xpH,xpH/2); ctx.fillStyle='rgba(255,255,255,0.05)'; ctx.fill();
  if(xpCur>0){
    const xw=Math.max(bw*(xpCur/xpRange),xpH);
    const xg=ctx.createLinearGradient(bx,0,bx+bw,0);
    xg.addColorStop(0,'#5B21B6'); xg.addColorStop(1,'#A855F7');
    rR(bx,xpY,xw,xpH,xpH/2); ctx.fillStyle=xg; ctx.fill();
  }
  ctx.font='9px sans-serif'; ctx.fillStyle='rgba(255,255,255,0.38)';
  ctx.textAlign='left';  ctx.fillText('XP', bx+5, xpY+xpH-1);
  ctx.textAlign='right'; ctx.fillText(xpCur+'/'+xpRange, bx+bw-5, xpY+xpH-1);
}

// ─── NAVIGATION BAR ──────────────────────────────────────────────────────────
function drawNav(){
  ctx.fillStyle='#0F1120'; ctx.fillRect(0,VH-NAV_H,VW,NAV_H);
  ctx.fillStyle='rgba(255,255,255,0.10)'; ctx.fillRect(0,VH-NAV_H,VW,1);

  const tabW=VW/NAV_TABS.length;
  NAV_TABS.forEach((tab,i)=>{
    const x=i*tabW, cx=x+tabW/2, active=navTab===tab;

    if(active){
      ctx.fillStyle='#F39C12'; ctx.fillRect(x+8,VH-NAV_H,tabW-16,2);
      ctx.fillStyle='rgba(243,156,18,0.09)'; ctx.fillRect(x,VH-NAV_H,tabW,NAV_H);
    }

    ctx.font='20px sans-serif'; ctx.textAlign='center';
    ctx.globalAlpha=active?1.0:0.34; ctx.fillStyle='#FFFFFF';
    ctx.fillText(NAV_ICONS[i], cx, VH-NAV_H+24);
    ctx.globalAlpha=1;

    ctx.font=(active?'bold ':'')+' 9px sans-serif';
    ctx.fillStyle=active?'#F39C12':'rgba(255,255,255,0.34)';
    ctx.fillText(NAV_LABELS[i], cx, VH-NAV_H+41);
  });
}

// ─── TAB SCREENS ─────────────────────────────────────────────────────────────
function drawTabScreen(tab){
  ctx.fillStyle='#0C0D1A';
  ctx.fillRect(0,HDR_H,VW,VH-HDR_H-NAV_H);
  if(tab==='character') drawCharacterTab();
  else if(tab==='map')     drawMapTab();
  else if(tab==='quests')  drawQuestsTab();
  else if(tab==='profile') drawProfileTab();
}

// Section header bar inside a tab
function tabTitle(text){
  const y=HDR_H;
  ctx.fillStyle='#14162A'; ctx.fillRect(0,y,VW,46);
  ctx.fillStyle='rgba(255,255,255,0.07)'; ctx.fillRect(0,y+46,VW,1);
  ctx.fillStyle='#FFFFFF'; ctx.font='bold 16px sans-serif'; ctx.textAlign='center';
  ctx.fillText(text, VW/2, y+30);
}

// Reusable small stat card
function statCard(x,y,w,h,label,value,col){
  rR(x,y,w,h,8);
  ctx.fillStyle='#1A1D30'; ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.07)'; ctx.lineWidth=1; ctx.stroke();
  ctx.fillStyle=col||'#F39C12'; ctx.font='bold 20px sans-serif'; ctx.textAlign='center';
  ctx.fillText(value, x+w/2, y+h*0.56);
  ctx.fillStyle='rgba(255,255,255,0.40)'; ctx.font='11px sans-serif';
  ctx.fillText(label, x+w/2, y+h*0.86);
}

function drawCharacterTab(){
  tabTitle('ПЕРСОНАЖ');
  const c=(ST==='PLAY'&&pl)?pl.char:selC;
  const cfg=CHAR[c];
  const ad=imgs.ch[c].idle;
  const fw=ad.w/ad.f, spSx=ad.tx||0, spSy=ad.ty||0;
  const spSw=ad.tw||fw, spSh=ad.th||ad.h;
  const sc2=3.0, dh=spSh*sc2, dw=spSw*sc2, baseY=HDR_H+56;

  // Character portrait area
  ctx.fillStyle='#12142A'; ctx.fillRect(0,HDR_H+46,VW,dh+28);
  // Glow behind sprite
  const rg=ctx.createRadialGradient(VW*0.26,baseY+dh*0.5,10,VW*0.26,baseY+dh*0.5,90);
  rg.addColorStop(0,cfg.c+'44'); rg.addColorStop(1,'transparent');
  ctx.fillStyle=rg; ctx.fillRect(0,HDR_H+46,VW,dh+28);
  ctx.drawImage(ad.im,spSx,spSy,spSw,spSh, VW*0.26-dw/2, baseY, dw, dh);

  // Equipment slots (right column)
  const slots=[
    {icon:'⚔️', label:'Оружие', item:'Деревянный меч'},
    {icon:'🛡️', label:'Броня',  item:null},
    {icon:'⛑️', label:'Шлем',   item:null},
    {icon:'👟', label:'Сапоги', item:null},
  ];
  const sx=VW*0.50, sg=58;
  slots.forEach((slot,i)=>{
    const ty=baseY+i*sg;
    rR(sx,ty,VW-sx-14,48,8);
    ctx.fillStyle=slot.item?'#1E2038':'#141628'; ctx.fill();
    ctx.strokeStyle=slot.item?cfg.c+'55':'rgba(255,255,255,0.08)';
    ctx.lineWidth=1; ctx.stroke();
    ctx.font='18px sans-serif'; ctx.textAlign='left'; ctx.fillStyle='#FFF';
    ctx.fillText(slot.icon, sx+10, ty+30);
    ctx.fillStyle='rgba(255,255,255,0.38)'; ctx.font='10px sans-serif';
    ctx.fillText(slot.label, sx+34, ty+16);
    ctx.fillStyle=slot.item?'#FFFFFF':'rgba(255,255,255,0.22)';
    ctx.font=slot.item?'bold 12px sans-serif':'12px sans-serif';
    ctx.fillText(slot.item||'— пусто —', sx+34, ty+34);
  });

  // Stats strip
  const sy2=baseY+dh+16;
  const sw2=(VW-28)/3;
  [['⚔','Сила',cfg.dm],['🛡','HP',cfg.hp],['⚡','Скор.',cfg.as.toFixed(1)]].forEach(([ic,lb,vl],i)=>{
    statCard(10+i*(sw2+4), sy2, sw2, 56, lb, ic+' '+vl, cfg.c);
  });
}

function drawMapTab(){
  tabTitle('КАРТА');
  const mapX=12, mapY=HDR_H+56, mapW=VW-24, mapH=226;
  // Map panel
  rR(mapX,mapY,mapW,mapH,10);
  ctx.fillStyle='#0D1F12'; ctx.fill();
  ctx.strokeStyle='rgba(46,204,113,0.18)'; ctx.lineWidth=1; ctx.stroke();
  // Grid
  ctx.save(); ctx.strokeStyle='rgba(255,255,255,0.04)'; ctx.lineWidth=1;
  for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(mapX,mapY+i*45);ctx.lineTo(mapX+mapW,mapY+i*45);ctx.stroke();}
  for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(mapX+i*(mapW/6),mapY);ctx.lineTo(mapX+i*(mapW/6),mapY+mapH);ctx.stroke();}
  ctx.restore();
  // Enemy markers
  [[0.22,0.33,'#E74C3C'],[0.72,0.62,'#E74C3C'],[0.52,0.22,'#9B59B6']].forEach(([rx,ry,mc])=>{
    const ex=mapX+mapW*rx, ey=mapY+mapH*ry;
    ctx.fillStyle=mc+'99'; ctx.beginPath(); ctx.arc(ex,ey,6,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle=mc; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(ex,ey,6,0,Math.PI*2); ctx.stroke();
    ctx.font='10px sans-serif'; ctx.fillStyle='#FFF'; ctx.textAlign='center';
    ctx.fillText('!',ex,ey+4);
  });
  // Player pin + pulse
  const px=VW/2, py=mapY+mapH*0.52;
  const t=(Date.now()/800)%1;
  ctx.save(); ctx.globalAlpha=0.5*(1-t);
  ctx.strokeStyle='#F39C12'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(px,py,10+t*24,0,Math.PI*2); ctx.stroke();
  ctx.restore();
  ctx.fillStyle='#F39C12'; ctx.beginPath(); ctx.arc(px,py,9,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#0F1120'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
  ctx.fillText('★',px,py+4);

  // Stats below map
  const sy=mapY+mapH+18;
  ctx.fillStyle='rgba(255,255,255,0.65)'; ctx.font='bold 14px sans-serif'; ctx.textAlign='center';
  ctx.fillText('Текущая локация', VW/2, sy);
  ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.font='12px sans-serif';
  ctx.fillText('Лучшая волна '+bestWave+'  ·  Игр сыграно '+gamesPlayed, VW/2, sy+22);
}

function drawQuestsTab(){
  tabTitle('ЗАДАНИЯ');
  const cfg=(ST==='PLAY'&&pl)?pl.cfg:CHAR[selC];
  const qs=[
    {label:'Убить 10 врагов',    cur:Math.min(totalKills,10),  tgt:10,  rwd:'💰 50'},
    {label:'Убить 50 врагов',    cur:Math.min(totalKills,50),  tgt:50,  rwd:'💰 200'},
    {label:'Достичь волны 5',    cur:Math.min(bestWave,5),     tgt:5,   rwd:'⭐ 100 XP'},
    {label:'Достичь волны 15',   cur:Math.min(bestWave,15),    tgt:15,  rwd:'⭐ 300 XP'},
    {label:'Набрать 500 очков',  cur:Math.min(bestScore,500),  tgt:500, rwd:'💰 150'},
  ];
  const qy=HDR_H+58, qh=68, qg=6;
  qs.forEach((q,i)=>{
    const ty=qy+i*(qh+qg);
    const done=q.cur>=q.tgt;
    const pct=Math.min(q.cur/q.tgt,1);
    rR(12,ty,VW-24,qh,8);
    ctx.fillStyle=done?'#1C2838':'#151728'; ctx.fill();
    ctx.strokeStyle=done?cfg.c+'44':'rgba(255,255,255,0.07)'; ctx.lineWidth=1; ctx.stroke();

    ctx.fillStyle=done?'#FFFFFF':'rgba(255,255,255,0.80)';
    ctx.font=(done?'bold ':'')+' 13px sans-serif'; ctx.textAlign='left';
    ctx.fillText(q.label, 22, ty+21);

    ctx.fillStyle='#F39C12'; ctx.font='12px sans-serif'; ctx.textAlign='right';
    ctx.fillText(q.rwd, VW-20, ty+21);

    const bx=22, bw2=VW-44, bh2=6;
    rR(bx,ty+30,bw2,bh2,3); ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.fill();
    if(pct>0){
      const pg=ctx.createLinearGradient(bx,0,bx+bw2,0);
      pg.addColorStop(0,cfg.c+'99'); pg.addColorStop(1,cfg.c);
      rR(bx,ty+30,Math.max(bw2*pct,bh2),bh2,3); ctx.fillStyle=pg; ctx.fill();
    }
    ctx.fillStyle='rgba(255,255,255,0.40)'; ctx.font='11px sans-serif'; ctx.textAlign='left';
    ctx.fillText(q.cur+' / '+q.tgt, bx, ty+56);
    if(done){
      rR(VW-80,ty+40,66,22,6); ctx.fillStyle=cfg.c; ctx.fill();
      ctx.fillStyle='#FFF'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
      ctx.fillText('✓ Готово', VW-47, ty+55);
    }
  });
}

function drawProfileTab(){
  tabTitle('ПРОФИЛЬ');
  const c=(ST==='PLAY'&&pl)?pl.char:selC;
  const cfg=CHAR[c];
  // Big avatar circle
  const avR=52, avX=VW/2, avY=HDR_H+114;
  ctx.fillStyle=cfg.c+'22';
  ctx.beginPath(); ctx.arc(avX,avY,avR,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=cfg.c; ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.arc(avX,avY,avR,0,Math.PI*2); ctx.stroke();
  // Sprite inside avatar
  const ad=imgs.ch[c].idle;
  const fw=ad.w/ad.f, spSx=ad.tx||0, spSy=ad.ty||0;
  const spSw=ad.tw||fw, spSh=ad.th||ad.h;
  ctx.save();
  ctx.beginPath(); ctx.arc(avX,avY,avR-2,0,Math.PI*2); ctx.clip();
  const psc=avR*2*0.90/Math.max(spSw,spSh);
  ctx.drawImage(ad.im,spSx,spSy,spSw,spSh, avX-spSw*psc/2, avY-spSh*psc*0.56, spSw*psc, spSh*psc);
  ctx.restore();

  // Name + level
  const ny=avY+avR+22;
  ctx.fillStyle='#FFFFFF'; ctx.font='bold 18px sans-serif'; ctx.textAlign='center';
  ctx.fillText(cfg.n, VW/2, ny);
  ctx.font='12px sans-serif'; ctx.fillStyle=cfg.c;
  ctx.fillText(cfg.cl+' · Уровень '+plLv, VW/2, ny+18);

  // XP progress bar
  const xpPrev=XP_TO_LV[plLv-1]||0;
  const xpNext=XP_TO_LV[plLv]||XP_TO_LV[XP_TO_LV.length-1];
  const xpCur=Math.max(0,xp-xpPrev), xpRange=Math.max(1,xpNext-xpPrev);
  const barX=28, barW=VW-56, barY=ny+30, barH=10;
  rR(barX,barY,barW,barH,barH/2); ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.fill();
  if(xpCur>0){
    const xg=ctx.createLinearGradient(barX,0,barX+barW,0);
    xg.addColorStop(0,'#5B21B6'); xg.addColorStop(1,'#A855F7');
    rR(barX,barY,Math.max(barW*xpCur/xpRange,barH),barH,barH/2); ctx.fillStyle=xg; ctx.fill();
  }
  ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.font='11px sans-serif';
  ctx.fillText('XP: '+xpCur+' / '+xpRange, VW/2, barY+barH+16);

  // Stats grid
  const stats=[
    {label:'Убито',   val:totalKills,  ic:'⚔'},
    {label:'Рекорд',  val:bestScore,   ic:'🏆'},
    {label:'Волна',   val:bestWave,    ic:'🌊'},
    {label:'Игр',     val:gamesPlayed, ic:'🎮'},
    {label:'Золото',  val:gold,        ic:'💰'},
    {label:'Опыт',    val:xp,          ic:'⭐'},
  ];
  const cols=3, csw=(VW-28)/cols, csh=62, csx=10, csy=barY+barH+34;
  stats.forEach((st,k)=>{
    const col=k%cols, row=Math.floor(k/cols);
    statCard(csx+col*(csw+4), csy+row*(csh+6), csw, csh, st.ic+' '+st.label, st.val, cfg.c);
  });
}
