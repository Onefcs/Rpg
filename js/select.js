// Theme environments per character
const CARD_THEME={
  warrior:{label:'Ближний бой', deco:'lava'},
  mage:   {label:'Магия',       deco:'arcane'},
  archer: {label:'Стрелок',     deco:'forest'},
  assasin:{label:'Скрытность',  deco:'shadow'},
  zhnec:  {label:'Защита',      deco:'gold'},
};

function initSel(){
  saf=Array(5).fill(0); sat=0;
  curBG=0; bgCT=0; bgO=Array(4).fill(0);
}

function updSel(dt){
  sat+=dt;
  if(sat>110){sat=0;CORD.forEach((c,i)=>{saf[i]=(saf[i]+1)%imgs.ch[c].idle.f;});}
  const bgCfg=BG_CONFIG[BGS[curBG]];
  bgO=bgO.map((o,i)=>(o+bgCfg.speeds[i]*1.8)%VW);
  bgCT+=dt;
  if(bgCT>40000){bgCT=0;curBG=(curBG+1)%BGS.length;bgO=Array(4).fill(0);}
}

function drawSel(){
  drawBG();

  // Gradient overlay
  const ov=ctx.createLinearGradient(0,0,0,VH);
  ov.addColorStop(0,'rgba(4,4,18,0.88)');
  ov.addColorStop(0.45,'rgba(4,4,18,0.62)');
  ov.addColorStop(1,'rgba(4,4,18,0.90)');
  ctx.fillStyle=ov; ctx.fillRect(0,0,VW,VH);

  // Title
  ctx.save(); ctx.textAlign='center';
  ctx.shadowBlur=32; ctx.shadowColor='#F39C12';
  ctx.font='bold 46px sans-serif'; ctx.fillStyle='#FFFFFF';
  ctx.fillText('HERO',VW/2,62);
  ctx.fillStyle='#F39C12';
  ctx.fillText('RUNNER',VW/2,108);
  ctx.shadowBlur=0;

  // Decorative divider
  const lw=90;
  ctx.strokeStyle='rgba(243,156,18,0.50)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(VW/2-lw,122); ctx.lineTo(VW/2-24,122); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(VW/2+24,122); ctx.lineTo(VW/2+lw,122); ctx.stroke();
  ctx.fillStyle='#F39C12'; ctx.font='8px sans-serif';
  ctx.fillText('✦', VW/2, 125);

  ctx.font='13px sans-serif'; ctx.fillStyle='rgba(255,255,255,0.60)';
  ctx.fillText('Выберите своего героя',VW/2,142);
  ctx.restore();

  CORD.forEach((c,i)=>drawCard(c,i));

  // Pulsing hint
  const t=Date.now()/750;
  ctx.globalAlpha=0.50+0.50*Math.sin(t);
  ctx.fillStyle='#F39C12'; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
  ctx.fillText('▶  Нажмите выбранного ещё раз для старта  ◀',VW/2,CY+CH+48);
  ctx.globalAlpha=1;
}

function drawCard(c,i){
  const x=CX0+i*(CW+CG), y=CY, sel=selC===c, cfg=CHAR[c];
  const theme=CARD_THEME[c];

  ctx.save();

  // Outer glow on selection
  if(sel){ctx.shadowColor=cfg.c; ctx.shadowBlur=24;}

  // Card dark base
  rR(x,y,CW,CH,10);
  ctx.fillStyle='rgba(6,7,20,0.97)'; ctx.fill();
  ctx.shadowBlur=0;

  // Themed gradient fill (top→bottom)
  const tg=ctx.createLinearGradient(x,y,x,y+CH);
  tg.addColorStop(0, cfg.c+(sel?'50':'38'));
  tg.addColorStop(0.55,'rgba(0,0,0,0)');
  rR(x,y,CW,CH,10); ctx.fillStyle=tg; ctx.fill();

  // Background deco pattern
  drawCardDeco(x,y,cfg.c,theme.deco,sel);

  // Horizontal rule between sprite and stats area
  const ruleY=y+CH*0.695;
  const rg=ctx.createLinearGradient(x+10,0,x+CW-10,0);
  rg.addColorStop(0,'transparent'); rg.addColorStop(0.5,cfg.c+(sel?'88':'44')); rg.addColorStop(1,'transparent');
  ctx.strokeStyle=rg; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(x+10,ruleY); ctx.lineTo(x+CW-10,ruleY); ctx.stroke();

  // Card border
  ctx.strokeStyle=sel?cfg.c:'rgba(255,255,255,0.10)';
  ctx.lineWidth=sel?2:1;
  rR(x,y,CW,CH,10); ctx.stroke();

  ctx.restore();

  // Character sprite
  const ad=imgs.ch[c].idle;
  const fw=ad.w/ad.f;
  const spSx=saf[i]*fw+(ad.tx||0), spSy=ad.ty||0;
  const spSw=ad.tw||fw, spSh=ad.th||ad.h;
  const sprH=CH*0.50, sprW=spSw*(sprH/spSh);
  const sdx=x+(CW-sprW)/2, sdy=y+CH*0.09;

  // Sprite ambient glow
  ctx.save();
  ctx.shadowColor=cfg.c; ctx.shadowBlur=sel?18:10;
  ctx.drawImage(ad.im,spSx,spSy,spSw,spSh,sdx,sdy,sprW,sprH);
  ctx.restore();

  // Floor shadow ellipse under sprite
  ctx.save(); ctx.globalAlpha=sel?0.30:0.18;
  ctx.fillStyle=cfg.c;
  ctx.beginPath(); ctx.ellipse(x+CW/2,y+CH*0.645,sprW*0.40,3,0,0,Math.PI*2); ctx.fill();
  ctx.restore();

  // Class label (tiny, above name)
  ctx.save(); ctx.textAlign='center';
  ctx.font='7px sans-serif'; ctx.fillStyle=cfg.c+(sel?'CC':'88');
  ctx.fillText(theme.label.toUpperCase(),x+CW/2,y+CH*0.728);

  // Character name
  ctx.font=`bold ${sel?13:12}px sans-serif`;
  ctx.fillStyle=sel?'#FFF':'#CCC';
  if(sel){ctx.shadowColor=cfg.c; ctx.shadowBlur=10;}
  ctx.fillText(cfg.n,x+CW/2,y+CH*0.765);
  ctx.shadowBlur=0;
  ctx.restore();

  // Stat bars
  const bx=x+8, bw=CW-16, by=y+CH*0.800, bhs=3, g=10;
  mBar(bx,by,     bw,bhs,cfg.hp/10,  '#E74C3C');
  mBar(bx,by+g,   bw,bhs,cfg.as/2.5, '#F39C12');
  mBar(bx,by+g*2, bw,bhs,cfg.dm/5,   '#9B59B6');

  // Stat icons
  ctx.save(); ctx.font='7px sans-serif'; ctx.textAlign='right';
  ctx.fillStyle='rgba(255,255,255,0.35)';
  ctx.fillText('HP', x+CW-8, by+bhs);
  ctx.fillText('AS', x+CW-8, by+g+bhs);
  ctx.fillText('DM', x+CW-8, by+g*2+bhs);
  ctx.restore();
}

function drawCardDeco(x,y,col,deco,sel){
  ctx.save(); ctx.globalAlpha=sel?0.22:0.14;

  // Radial aura behind sprite
  const ra=ctx.createRadialGradient(x+CW/2,y+CH*0.34,0,x+CW/2,y+CH*0.34,CW*0.50);
  ra.addColorStop(0,col+'FF'); ra.addColorStop(1,'transparent');
  ctx.fillStyle=ra; ctx.fillRect(x,y,CW,CH*0.70);

  ctx.globalAlpha=sel?0.18:0.10;

  if(deco==='lava'){
    // Horizontal glowing cracks
    for(let k=0;k<3;k++){
      const ky=y+CH*0.15+k*CH*0.14;
      ctx.strokeStyle=col; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(x+5,ky); ctx.lineTo(x+CW-5,ky+4-k*2); ctx.stroke();
    }
  }else if(deco==='arcane'){
    // Concentric circles (sigil)
    for(let k=1;k<=3;k++){
      ctx.strokeStyle=col; ctx.lineWidth=0.8;
      ctx.beginPath(); ctx.arc(x+CW/2,y+CH*0.34,k*10,0,Math.PI*2); ctx.stroke();
    }
  }else if(deco==='forest'){
    // Vertical lines (trees)
    for(let k=0;k<5;k++){
      const tx=x+10+k*15;
      ctx.strokeStyle=col; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(tx,y+CH*0.60); ctx.lineTo(tx,y+CH*0.15); ctx.stroke();
    }
  }else if(deco==='shadow'){
    // Diagonal slashes
    for(let k=0;k<4;k++){
      ctx.strokeStyle=col; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(x+k*28,y+5); ctx.lineTo(x+k*28-20,y+CH*0.65); ctx.stroke();
    }
  }else if(deco==='gold'){
    // Diamond shape
    ctx.strokeStyle=col; ctx.lineWidth=1;
    const mx=x+CW/2, my=y+CH*0.34, r=20;
    ctx.beginPath(); ctx.moveTo(mx,my-r); ctx.lineTo(mx+r,my); ctx.lineTo(mx,my+r); ctx.lineTo(mx-r,my); ctx.closePath(); ctx.stroke();
  }

  ctx.restore();
}

function mBar(x,y,w,h,p,col){
  ctx.fillStyle='rgba(255,255,255,0.07)'; ctx.fillRect(x,y,w,h);
  const grad=ctx.createLinearGradient(x,0,x+w,0);
  grad.addColorStop(0,col+'CC'); grad.addColorStop(1,col);
  ctx.fillStyle=grad; ctx.fillRect(x,y,w*Math.min(p,1),h);
}
