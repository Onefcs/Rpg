// Theme environments per character
const CARD_THEME={
  warrior:{label:'Ближний бой'},
  mage:   {label:'Магия'},
  archer: {label:'Стрелок'},
  assasin:{label:'Скрытность'},
  zhnec:  {label:'Защита'},
};

function initSel(){
  saf=Array(5).fill(0); sat=0;
  curBG=0; bgCT=0; bgO=Array(BG_SCROLL_LAYERS.length).fill(0);
}

function updSel(dt){
  sat+=dt;
  if(sat>110){sat=0;CORD.forEach((c,i)=>{saf[i]=(saf[i]+1)%imgs.ch[c].idle.f;});}
  const bgCfg=BG_CONFIG[BGS[curBG]];
  bgO=bgO.map((o,i)=>o+bgCfg.speeds[i]*1.8);
  bgCT+=dt;
  if(bgCT>40000){bgCT=0;curBG=(curBG+1)%BGS.length;bgO=Array(BG_SCROLL_LAYERS.length).fill(0);}
}

function drawSel(){
  drawBG();

  // Gradient overlay
  const ov=ctx.createLinearGradient(0,0,0,VH);
  ov.addColorStop(0,'rgba(14,22,33,0.90)');
  ov.addColorStop(0.45,'rgba(14,22,33,0.68)');
  ov.addColorStop(1,'rgba(14,22,33,0.92)');
  ctx.fillStyle=ov; ctx.fillRect(0,0,VW,VH);

  // Title (offset below header)
  const yo=HDR_H+8;
  ctx.save(); ctx.textAlign='center';
  ctx.font='bold 34px sans-serif'; ctx.fillStyle='#FFFFFF';
  ctx.fillText('HERO',VW/2,yo+28);
  ctx.fillStyle=TG.blue;
  ctx.fillText('RUNNER',VW/2,yo+66);

  // Decorative divider
  const lw=90;
  ctx.strokeStyle=TG.divider; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(VW/2-lw,yo+82); ctx.lineTo(VW/2-24,yo+82); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(VW/2+24,yo+82); ctx.lineTo(VW/2+lw,yo+82); ctx.stroke();
  ctx.fillStyle=TG.blue; ctx.font='8px sans-serif';
  ctx.fillText('✦', VW/2, yo+85);

  ctx.font='13px sans-serif'; ctx.fillStyle=TG.txt2;
  ctx.fillText('Выберите своего героя',VW/2,yo+104);
  ctx.restore();

  CORD.forEach((c,i)=>drawCard(c,i));

  // Pulsing hint
  const t=Date.now()/750;
  ctx.globalAlpha=0.50+0.50*Math.sin(t);
  ctx.fillStyle=TG.blue; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
  ctx.fillText('▶  Нажмите выбранного ещё раз для старта  ◀',VW/2,CY+CH+48);
  ctx.globalAlpha=1;
}

function drawCard(c,i){
  const x=CX0+i*(CW+CG), y=CY, sel=selC===c, cfg=CHAR[c];
  const theme=CARD_THEME[c];

  // Card base
  rR(x,y,CW,CH,14);
  ctx.fillStyle=sel?TG.selected:TG.card; ctx.fill();
  ctx.strokeStyle=sel?TG.blue:TG.divider;
  ctx.lineWidth=sel?2:1;
  rR(x,y,CW,CH,14); ctx.stroke();

  // Character sprite
  const ad=imgs.ch[c].idle;
  const fw=ad.w/ad.f;
  const spSx=saf[i]*fw+(ad.tx||0), spSy=ad.ty||0;
  const spSw=ad.tw||fw, spSh=ad.th||ad.h;
  const sprH=CH*0.50, sprW=spSw*(sprH/spSh);
  const sdx=x+(CW-sprW)/2, sdy=y+CH*0.09;

  ctx.save();
  ctx.globalAlpha=sel?1:0.85;
  ctx.drawImage(ad.im,spSx,spSy,spSw,spSh,sdx,sdy,sprW,sprH);
  ctx.restore();

  // Floor shadow ellipse under sprite
  ctx.save(); ctx.globalAlpha=sel?0.28:0.16;
  ctx.fillStyle='#000';
  ctx.beginPath(); ctx.ellipse(x+CW/2,y+CH*0.645,sprW*0.40,3,0,0,Math.PI*2); ctx.fill();
  ctx.restore();

  // Horizontal rule between sprite and stats area
  const ruleY=y+CH*0.695;
  ctx.strokeStyle=TG.divider; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(x+10,ruleY); ctx.lineTo(x+CW-10,ruleY); ctx.stroke();

  // Class label (tiny, above name)
  ctx.save(); ctx.textAlign='center';
  ctx.font='7px sans-serif'; ctx.fillStyle=sel?TG.blue:TG.txt3;
  ctx.fillText(theme.label.toUpperCase(),x+CW/2,y+CH*0.728);

  // Character name
  ctx.font=`bold ${sel?13:12}px sans-serif`;
  ctx.fillStyle=sel?'#FFF':'#CCC';
  ctx.fillText(cfg.n,x+CW/2,y+CH*0.765);
  ctx.restore();

  // Selected checkmark
  if(sel) tgCheck(x+CW-14, y+14, 8, TG.blue);

  // Stat bars
  const bx=x+8, bw=CW-16, by=y+CH*0.800, bhs=3, g=10;
  mBar(bx,by,     bw,bhs,cfg.hp/10,  TG.red);
  mBar(bx,by+g,   bw,bhs,cfg.as/2.5, TG.gold);
  mBar(bx,by+g*2, bw,bhs,cfg.dm/5,   TG.blue);

  // Stat icons
  ctx.save(); ctx.font='7px sans-serif'; ctx.textAlign='right';
  ctx.fillStyle=TG.txt3;
  ctx.fillText('HP', x+CW-8, by+bhs);
  ctx.fillText('AS', x+CW-8, by+g+bhs);
  ctx.fillText('DM', x+CW-8, by+g*2+bhs);
  ctx.restore();
}

function mBar(x,y,w,h,p,col){
  ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.fillRect(x,y,w,h);
  ctx.fillStyle=col; ctx.fillRect(x,y,w*Math.min(p,1),h);
}
