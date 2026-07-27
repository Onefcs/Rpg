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
  if(lastDrop){
    const age=performance.now()-lastDrop.t;
    if(age<2800){
      const a=Math.max(0,1-age/2800);
      const item=lastDrop.item;
      const rc=RARITIES[item.rarity].col;
      const nw=250,nh=50,nx=(VW-nw)/2,ny=HDR_H+50;
      ctx.save(); ctx.globalAlpha=a;
      rR(nx,ny,nw,nh,14); ctx.fillStyle=TG.panel; ctx.fill();
      ctx.strokeStyle=TG.divider; ctx.lineWidth=1; ctx.stroke();
      ctx.fillStyle=rc; ctx.fillRect(nx,ny,3,nh);
      ctx.font='bold 13px sans-serif'; ctx.fillStyle=TG.txt; ctx.textAlign='center';
      ctx.fillText(SLOT_ICONS[SLOT_TYPES.indexOf(item.slot)]+' '+item.name, VW/2, ny+19);
      ctx.font='11px sans-serif'; ctx.fillStyle=rc;
      ctx.fillText('✦ '+RARITIES[item.rarity].n+' · экипировано', VW/2, ny+38);
      ctx.restore();
    } else { lastDrop=null; }
  }
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
    ctx.drawImage(ad.im,sx,sy,sw,sh,dx,dy,dw,dh);
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
    ctx.fillStyle=p.col;
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
  ctx.font='bold 15px sans-serif'; ctx.textAlign='left';
  const scW=ctx.measureText(scTxt).width+22;
  rR(10,y0,scW,30,15); ctx.fillStyle='rgba(23,33,43,0.90)'; ctx.fill();
  ctx.strokeStyle=TG.divider; ctx.lineWidth=1; ctx.stroke();
  ctx.fillStyle=TG.blue; ctx.fillText(scTxt,21,y0+21);
  // Location pill (right)
  const loc=LOCATIONS[curLoc];
  const locTxt=loc.icon+' '+'★'.repeat(loc.tier);
  ctx.font='bold 13px sans-serif'; ctx.textAlign='right';
  const wvW=ctx.measureText(locTxt).width+22;
  rR(VW-10-wvW,y0,wvW,30,15); ctx.fillStyle='rgba(23,33,43,0.90)'; ctx.fill();
  ctx.strokeStyle=TG.divider; ctx.lineWidth=1; ctx.stroke();
  ctx.fillStyle=TG.txt; ctx.fillText(locTxt,VW-11,y0+21);
  ctx.font='10px sans-serif'; ctx.fillStyle=TG.txt3;
  ctx.fillText(loc.n,VW-11,y0+41);
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
  ctx.fillStyle='rgba(14,22,33,0.90)'; ctx.fillRect(0,0,VW,VH);
  ctx.save(); ctx.textAlign='center';
  // Alert-style dialog card (Telegram modal)
  const cw=VW*0.72, ch=210, cx=(VW-cw)/2, cy=VH*0.34;
  rR(cx,cy,cw,ch,18); ctx.fillStyle=TG.panel; ctx.fill();
  ctx.strokeStyle=TG.divider; ctx.lineWidth=1; ctx.stroke();

  ctx.font='bold 22px sans-serif'; ctx.fillStyle=TG.txt;
  ctx.fillText('Игра окончена',VW/2,cy+42);

  ctx.font='12px sans-serif'; ctx.fillStyle=TG.txt2;
  ctx.fillText('РЕЗУЛЬТАТ',VW/2,cy+76);
  ctx.font='bold 38px sans-serif'; ctx.fillStyle=TG.blue;
  ctx.fillText(sc,VW/2,cy+118);

  ctx.restore();
  tgButton(cx+16, cy+ch-52, cw-32, 40, 'ПРОДОЛЖИТЬ', true, TG.blue);

  ctx.save(); ctx.textAlign='center';
  const pulse=0.5+0.5*Math.sin(goT/400);
  ctx.globalAlpha=0.35+0.35*pulse;
  ctx.font='11px sans-serif'; ctx.fillStyle=TG.txt3;
  ctx.fillText('Нажмите в любом месте',VW/2,cy+ch+30);
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

  // ── Panel ──
  ctx.fillStyle=TG.panel;
  ctx.fillRect(0,0,VW,HDR_H);
  // Bottom separator
  ctx.fillStyle=TG.divider; ctx.fillRect(0,HDR_H-1,VW,1);

  // ── Avatar ──
  const avR=19, avX=34, avY=30;
  ctx.fillStyle=TG.blueSoft;
  ctx.beginPath(); ctx.arc(avX,avY,avR,0,Math.PI*2); ctx.fill();
  const ad=imgs.ch[c].idle;
  const fw=ad.w/ad.f, spSx=ad.tx||0, spSy=ad.ty||0;
  const spSw=ad.tw||fw, spSh=ad.th||ad.h;
  ctx.save();
  ctx.beginPath(); ctx.arc(avX,avY,avR-1,0,Math.PI*2); ctx.clip();
  const avSc=avR*2*0.90/Math.max(spSw,spSh);
  ctx.drawImage(ad.im,spSx,spSy,spSw,spSh, avX-spSw*avSc/2, avY-spSh*avSc*0.56, spSw*avSc, spSh*avSc);
  ctx.restore();
  ctx.strokeStyle=TG.blue; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.arc(avX,avY,avR,0,Math.PI*2); ctx.stroke();
  // Online-style status dot
  ctx.fillStyle=TG.panel;
  ctx.beginPath(); ctx.arc(avX+avR*0.72,avY+avR*0.72,5.5,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=TG.green;
  ctx.beginPath(); ctx.arc(avX+avR*0.72,avY+avR*0.72,3.6,0,Math.PI*2); ctx.fill();

  // ── Name ──
  const nx=avX+avR+11;
  ctx.fillStyle=TG.txt; ctx.font='bold 14px sans-serif'; ctx.textAlign='left';
  ctx.fillText(cfg.n, nx, avY-6);

  // ── Level badge ──
  ctx.font='bold 11px sans-serif';
  const lvTxt='Ур. '+plLv;
  const lvW=ctx.measureText(lvTxt).width+14;
  const lvX=VW-10-lvW, lvY0=6, lvH=20;
  rR(lvX,lvY0,lvW,lvH,lvH/2);
  ctx.fillStyle=TG.blueSoft; ctx.fill();
  ctx.fillStyle=TG.blue; ctx.textAlign='center';
  ctx.fillText(lvTxt, lvX+lvW/2, lvY0+14);

  // ── Class · score · gold ──
  ctx.font='11px sans-serif'; ctx.fillStyle=TG.txt2; ctx.textAlign='left';
  ctx.fillText(cfg.cl+' · ⚔ '+(isPlay?sc:0)+'  💰 '+gold, nx, avY+9);

  // ── HP bar ──
  const bx=8, bw=VW-16, hpY=avY+avR+8, hpH=13;
  const hpPct=Math.max(0,Math.min(curHp/maxHp,1));
  rR(bx,hpY,bw,hpH,hpH/2); ctx.fillStyle='rgba(255,255,255,0.06)'; ctx.fill();
  if(hpPct>0){
    const hw=Math.max(bw*hpPct,hpH);
    rR(bx,hpY,hw,hpH,hpH/2); ctx.fillStyle=TG.red; ctx.fill();
  }
  ctx.font='bold 10px sans-serif'; ctx.fillStyle='rgba(255,255,255,0.92)';
  ctx.textAlign='left';  ctx.fillText('HP', bx+6, hpY+hpH-2);
  ctx.textAlign='right'; ctx.fillText(curHp+'/'+maxHp, bx+bw-6, hpY+hpH-2);

  // ── XP bar ──
  const xpPrev=XP_TO_LV[plLv-1]||0;
  const xpNext=XP_TO_LV[plLv]||XP_TO_LV[XP_TO_LV.length-1];
  const xpCur=Math.max(0,xp-xpPrev), xpRange=Math.max(1,xpNext-xpPrev);
  const xpPct=Math.min(xpCur/xpRange,1);
  const xpY=hpY+hpH+5, xpH=9;
  rR(bx,xpY,bw,xpH,xpH/2); ctx.fillStyle='rgba(255,255,255,0.06)'; ctx.fill();
  if(xpPct>0){
    const xw=Math.max(bw*xpPct,xpH);
    rR(bx,xpY,xw,xpH,xpH/2); ctx.fillStyle=TG.blue; ctx.fill();
  }
  ctx.font='10px sans-serif'; ctx.fillStyle=TG.txt2;
  ctx.textAlign='left';  ctx.fillText('XP', bx+6, xpY+xpH-1);
  ctx.textAlign='right'; ctx.fillText(xpCur+'/'+xpRange, bx+bw-6, xpY+xpH-1);
}

// ─── NAVIGATION BAR ──────────────────────────────────────────────────────────
function drawNav(){
  ctx.fillStyle=TG.panel;
  ctx.fillRect(0,VH-NAV_H,VW,NAV_H);
  ctx.fillStyle=TG.divider; ctx.fillRect(0,VH-NAV_H,VW,1);

  const tabW=VW/NAV_TABS.length;
  NAV_TABS.forEach((tab,i)=>{
    const x=i*tabW, cx=x+tabW/2, active=navTab===tab;

    if(active){
      rR(x+tabW/2-14,VH-NAV_H+4,28,3,1.5);
      ctx.fillStyle=TG.blue; ctx.fill();
    }

    // Icon (emoji — sharp at any DPR once canvas is high-res)
    ctx.font='21px sans-serif'; ctx.textAlign='center';
    ctx.globalAlpha=active?1.0:0.42;
    ctx.fillStyle=active?TG.blue:'#FFFFFF';
    ctx.fillText(NAV_ICONS[i], cx, VH-NAV_H+32);
    ctx.globalAlpha=1;

    // Label
    ctx.font=(active?'bold ':'')+' 10px sans-serif';
    ctx.fillStyle=active?TG.blue:TG.txt3;
    ctx.fillText(NAV_LABELS[i], cx, VH-NAV_H+49);
  });
}

// ─── TAB SCREENS ─────────────────────────────────────────────────────────────
function drawTabScreen(tab){
  ctx.fillStyle=TG.bg;
  ctx.fillRect(0,HDR_H,VW,VH-HDR_H-NAV_H);
  if(tab==='inventory') drawInventoryTab();
  else if(tab==='map')     drawMapTab();
  else if(tab==='quests')  drawQuestsTab();
  else if(tab==='profile') drawProfileTab();
}

// Section header bar inside a tab
function tabTitle(text){
  const y=HDR_H;
  ctx.fillStyle=TG.panel; ctx.fillRect(0,y,VW,46);
  ctx.fillStyle=TG.divider; ctx.fillRect(0,y+46,VW,1);
  ctx.fillStyle=TG.txt; ctx.font='bold 16px sans-serif'; ctx.textAlign='center';
  ctx.fillText(text, VW/2, y+30);
}

// Reusable small stat card
function statCard(x,y,w,h,label,value,col){
  rR(x,y,w,h,10);
  ctx.fillStyle=TG.card; ctx.fill();
  ctx.fillStyle=col||TG.blue; ctx.font='bold 20px sans-serif'; ctx.textAlign='center';
  ctx.fillText(value, x+w/2, y+h*0.56);
  ctx.fillStyle=TG.txt3; ctx.font='11px sans-serif';
  ctx.fillText(label, x+w/2, y+h*0.86);
}

function drawInventoryTab(){
  tabTitle('ИНВЕНТАРЬ');
  const y0=HDR_H+52;
  const slotH=50, slotGap=5, colW=(VW-26)/2;

  // ── Equipment grid (5 rows × 2 cols), Telegram list-row style ──
  SLOT_TYPES.forEach((slot,i)=>{
    const col=i%2, row=Math.floor(i/2);
    const sx=10+col*(colW+6), sy=y0+row*(slotH+slotGap);
    const item=equipped[slot];
    const tile=TG_ICON_COLORS[i%TG_ICON_COLORS.length];

    rR(sx,sy,colW,slotH,10);
    ctx.fillStyle=TG.card; ctx.fill();

    // Icon tile
    const ts=32;
    ctx.globalAlpha=item?1:0.45;
    tgIconTile(sx+8,sy+(slotH-ts)/2,ts,item?tile:'rgba(255,255,255,0.08)',SLOT_ICONS[i],17);
    ctx.globalAlpha=1;

    if(item){
      const rc=RARITIES[item.rarity].col;
      ctx.fillStyle=TG.txt; ctx.font='bold 11px sans-serif'; ctx.textAlign='left';
      ctx.fillText(item.name, sx+48, sy+19);
      ctx.fillStyle=rc; ctx.font='10px sans-serif';
      ctx.fillText(RARITIES[item.rarity].n, sx+48, sy+33);
      // Bonus summary
      const bonusTxt=(SLOT_BONUS[slot]||[]).map(b=>{
        const v=(b.base*(item.rarity+1)*0.8).toFixed(1);
        return '+'+v+' '+STAT_DISP[b.stat];
      }).join('  ');
      ctx.fillStyle=TG.txt3; ctx.font='9px sans-serif';
      ctx.fillText(bonusTxt, sx+48, sy+46);
    } else {
      ctx.fillStyle=TG.txt2; ctx.font='11px sans-serif'; ctx.textAlign='left';
      ctx.fillText(SLOT_LABELS[i], sx+48, sy+19);
      ctx.fillStyle=TG.txt3; ctx.font='10px sans-serif';
      ctx.fillText('— пусто —', sx+48, sy+35);
    }
  });

  // ── Stat upgrades ──
  const gridEnd=y0+5*slotH+4*slotGap;
  const secY=gridEnd+12;
  const es=eff();
  ctx.fillStyle=TG.txt3; ctx.font='bold 10px sans-serif'; ctx.textAlign='left';
  ctx.fillText('ПРОКАЧКА ХАРАКТЕРИСТИК', 12, secY+1);
  ctx.fillStyle=TG.gold; ctx.font='bold 10px sans-serif'; ctx.textAlign='right';
  ctx.fillText('💰 '+gold, VW-12, secY+1);

  const statKeys=['hp','dm','df','as','cc','cr'];
  const cw=(VW-28)/3, ch=70, cg=4;
  const cardsY=secY+14;

  statKeys.forEach((sk,i)=>{
    const col=i%3, row=Math.floor(i/3);
    const cx=10+col*(cw+cg), cy=cardsY+row*(ch+cg);
    const lv=statUpgrades[sk]||0;
    const cost=Math.round((UPGRADE_BASE_COST[sk]||50)*Math.pow(1.5,lv));
    const canAfford=gold>=cost;

    rR(cx,cy,cw,ch,10);
    ctx.fillStyle=TG.card; ctx.fill();

    // Stat label
    ctx.fillStyle=TG.txt3; ctx.font='10px sans-serif'; ctx.textAlign='center';
    ctx.fillText(STAT_LABELS[sk], cx+cw/2, cy+14);

    // Current value
    let valStr;
    if(sk==='cc')      valStr=Math.round(es.cc*100)+'%';
    else if(sk==='cr') valStr=es.cr.toFixed(1)+'×';
    else if(sk==='as') valStr=es.as.toFixed(1);
    else if(sk==='hp') valStr=String(es.hp);
    else               valStr=es.dm.toFixed(1); // dm or df
    if(sk==='df') valStr=es.df.toFixed(1);

    ctx.fillStyle=TG.txt; ctx.font='bold 18px sans-serif';
    ctx.fillText(valStr, cx+cw/2, cy+36);

    // Level indicator
    if(lv>0){
      ctx.fillStyle=TG.blue;
      ctx.font='8px sans-serif';
      ctx.fillText('Ур.'+lv, cx+cw/2, cy+48);
    }

    // Upgrade button
    const btnW=cw-12, btnH=17, btnX=cx+6, btnY=cy+ch-22;
    tgButton(btnX,btnY,btnW,btnH,'+ '+cost+' 💰',canAfford);
  });
}

function drawMapTab(){
  tabTitle('ЛОКАЦИИ');
  const unlockAt=[0,10,50,200];
  const cardX=10, cardW=VW-20, cardH=152, cardGap=8;
  const startY=HDR_H+56;

  LOCATIONS.forEach((loc,i)=>{
    const cy=startY+i*(cardH+cardGap);
    const active=curLoc===i;
    const unlocked=totalKills>=unlockAt[i];

    rR(cardX,cy,cardW,cardH,14);
    ctx.fillStyle=active?TG.selected:TG.card; ctx.fill();

    ctx.globalAlpha=unlocked?1:0.32;

    // Icon avatar circle
    const avR=24, avX=cardX+16+avR, avY=cy+16+avR;
    ctx.fillStyle=unlocked?TG.blueSoft:'rgba(255,255,255,0.06)';
    ctx.beginPath(); ctx.arc(avX,avY,avR,0,Math.PI*2); ctx.fill();
    ctx.font='24px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(loc.icon, avX, avY+1);
    ctx.textBaseline='alphabetic';

    // Name
    const tx0=cardX+16+avR*2+14;
    ctx.fillStyle=TG.txt; ctx.textAlign='left';
    ctx.font=(active?'bold ':'')+'15px sans-serif';
    ctx.fillText(loc.n, tx0, cy+30);

    // Stars
    ctx.fillStyle=TG.gold; ctx.font='13px sans-serif';
    ctx.fillText('★'.repeat(loc.tier)+'☆'.repeat(4-loc.tier), tx0, cy+50);

    // Enemies
    const minT=Math.max(0,i-1), maxT=Math.min(ET.length-1,i);
    const enemies=ET.slice(minT,maxT+1).map(e=>e.n).join(', ');
    ctx.fillStyle=TG.txt2; ctx.font='11px sans-serif';
    ctx.fillText(enemies, tx0, cy+70);

    // Multipliers
    ctx.fillStyle=TG.txt3; ctx.font='11px sans-serif';
    ctx.fillText('HP ×'+loc.hpMult+'  XP ×'+loc.xpMult+'  Скор. ×'+(loc.spd/3.5).toFixed(1), tx0, cy+90);

    ctx.globalAlpha=1;

    if(!unlocked){
      ctx.fillStyle=TG.txt3; ctx.font='bold 11px sans-serif'; ctx.textAlign='right';
      ctx.fillText('🔒 '+unlockAt[i]+' убийств', cardX+cardW-14, cy+cardH-18);
    } else if(active){
      tgCheck(cardX+cardW-24, cy+cardH-25, 10, TG.blue);
      ctx.fillStyle=TG.blue; ctx.font='bold 11px sans-serif'; ctx.textAlign='right';
      ctx.fillText('АКТИВНА', cardX+cardW-40, cy+cardH-21);
    } else {
      tgButton(cardX+cardW-90,cy+cardH-38,80,26,'ВЫБРАТЬ',true);
    }

    ctx.textAlign='left';
  });

  if(mapMsg){
    const age=performance.now()-mapMsg.t;
    if(age<1600){
      const a=Math.min(1,(1600-age)/400,age/150);
      ctx.font='bold 13px sans-serif'; ctx.textAlign='center';
      const tw=ctx.measureText(mapMsg.text).width+24;
      const tx2=(VW-tw)/2, ty2=HDR_H+56;
      ctx.save(); ctx.globalAlpha=a;
      rR(tx2,ty2,tw,32,16); ctx.fillStyle=TG.panel; ctx.fill();
      ctx.strokeStyle=TG.red; ctx.lineWidth=1.5; ctx.stroke();
      ctx.fillStyle=TG.txt; ctx.fillText(mapMsg.text, VW/2, ty2+21);
      ctx.restore();
      ctx.textAlign='left';
    } else mapMsg=null;
  }
}

function drawQuestsTab(){
  tabTitle('ЗАДАНИЯ');
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
    rR(12,ty,VW-24,qh,12);
    ctx.fillStyle=TG.card; ctx.fill();

    ctx.fillStyle=done?TG.txt:'rgba(255,255,255,0.85)';
    ctx.font=(done?'bold ':'')+' 13px sans-serif'; ctx.textAlign='left';
    ctx.fillText(q.label, 22, ty+21);

    ctx.fillStyle=TG.gold; ctx.font='12px sans-serif'; ctx.textAlign='right';
    ctx.fillText(q.rwd, VW-20, ty+21);

    const bx=22, bw2=VW-44, bh2=6;
    rR(bx,ty+30,bw2,bh2,3); ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.fill();
    if(pct>0){
      rR(bx,ty+30,Math.max(bw2*pct,bh2),bh2,3); ctx.fillStyle=done?TG.green:TG.blue; ctx.fill();
    }
    ctx.fillStyle=TG.txt3; ctx.font='11px sans-serif'; ctx.textAlign='left';
    ctx.fillText(q.cur+' / '+q.tgt, bx, ty+56);
    if(done) tgCheck(VW-30, ty+49, 11, TG.green);
  });
}

function drawProfileTab(){
  tabTitle('ПРОФИЛЬ');
  const c=(ST==='PLAY'&&pl)?pl.char:selC;
  const cfg=CHAR[c];
  // Big avatar circle
  const avR=52, avX=VW/2, avY=HDR_H+114;
  ctx.fillStyle=TG.blueSoft;
  ctx.beginPath(); ctx.arc(avX,avY,avR,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=TG.blue; ctx.lineWidth=2.5;
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
  // Online-style status dot
  ctx.fillStyle=TG.bg;
  ctx.beginPath(); ctx.arc(avX+avR*0.72,avY+avR*0.72,10,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=TG.green;
  ctx.beginPath(); ctx.arc(avX+avR*0.72,avY+avR*0.72,6.5,0,Math.PI*2); ctx.fill();

  // Name + level
  const ny=avY+avR+22;
  ctx.fillStyle=TG.txt; ctx.font='bold 18px sans-serif'; ctx.textAlign='center';
  ctx.fillText(cfg.n, VW/2, ny);
  ctx.font='12px sans-serif'; ctx.fillStyle=TG.blue;
  ctx.fillText(cfg.cl+' · Уровень '+plLv, VW/2, ny+18);

  // XP progress bar
  const xpPrev=XP_TO_LV[plLv-1]||0;
  const xpNext=XP_TO_LV[plLv]||XP_TO_LV[XP_TO_LV.length-1];
  const xpCur=Math.max(0,xp-xpPrev), xpRange=Math.max(1,xpNext-xpPrev);
  const barX=28, barW=VW-56, barY=ny+30, barH=10;
  rR(barX,barY,barW,barH,barH/2); ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.fill();
  if(xpCur>0){
    rR(barX,barY,Math.max(barW*xpCur/xpRange,barH),barH,barH/2); ctx.fillStyle=TG.blue; ctx.fill();
  }
  ctx.fillStyle=TG.txt3; ctx.font='11px sans-serif';
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
    statCard(csx+col*(csw+4), csy+row*(csh+6), csw, csh, st.ic+' '+st.label, st.val, TG.blue);
  });
}
