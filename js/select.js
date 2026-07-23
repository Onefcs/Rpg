function initSel(){
  saf=Array(5).fill(0); sat=0;
  curBG=0; bgCT=0; bgO=Array(BG_CONFIG[BGS[0]].layers.length).fill(0);
}

function updSel(dt){
  sat+=dt;
  if(sat>110){sat=0;CORD.forEach((c,i)=>{saf[i]=(saf[i]+1)%imgs.ch[c].idle.f;});}
  const bgCfg=BG_CONFIG[BGS[curBG]];
  bgO=bgO.map((o,i)=>(o+bgCfg.speeds[i]*1.8)%VW);
  bgCT+=dt; if(bgCT>40000){bgCT=0;curBG=(curBG+1)%BGS.length;bgO=Array(BG_CONFIG[BGS[curBG]].layers.length).fill(0);}
}

function drawSel(){
  drawBG();
  ctx.fillStyle='rgba(4,4,16,0.68)'; ctx.fillRect(0,0,VW,VH);
  ctx.save(); ctx.textAlign='center';
  ctx.shadowBlur=22; ctx.shadowColor='#F39C12';
  ctx.font='bold 42px sans-serif'; ctx.fillStyle='#FFF'; ctx.fillText('HERO',VW/2,52);
  ctx.fillStyle='#F39C12'; ctx.fillText('RUNNER',VW/2,94);
  ctx.shadowBlur=0; ctx.font='15px sans-serif'; ctx.fillStyle='rgba(255,255,255,0.7)';
  ctx.fillText('Выберите персонажа',VW/2,114); ctx.restore();
  CORD.forEach((c,i)=>drawCard(c,i));
  const t=Date.now()/700;
  ctx.globalAlpha=0.55+0.45*Math.sin(t);
  ctx.fillStyle='#F39C12'; ctx.font='bold 16px sans-serif'; ctx.textAlign='center';
  ctx.fillText('▶  Нажмите выбранного персонажа ещё раз для старта  ◀',VW/2,CY+CH+38);
  ctx.globalAlpha=1;
}

function drawCard(c,i){
  const x=CX0+i*(CW+CG), y=CY, sel=selC===c, cfg=CHAR[c];
  ctx.save();
  if(sel){ctx.shadowColor=cfg.c; ctx.shadowBlur=18;}
  ctx.fillStyle=sel?cfg.c+'2A':'rgba(0,0,0,0.55)';
  rR(x,y,CW,CH,10); ctx.fill();
  ctx.strokeStyle=sel?cfg.c:'rgba(255,255,255,0.15)';
  ctx.lineWidth=sel?2:1; rR(x,y,CW,CH,10); ctx.stroke();
  ctx.restore();
  const ad=imgs.ch[c].idle;
  const fw=ad.w/ad.f;
  const spSx=saf[i]*fw+(ad.tx||0), spSy=ad.ty||0, spSw=ad.tw||fw, spSh=ad.th||ad.h;
  const sprH=CH*0.52, sprW=spSw*(sprH/spSh);
  ctx.drawImage(ad.im,spSx,spSy,spSw,spSh,x+(CW-sprW)/2,y+8,sprW,sprH);
  ctx.fillStyle=sel?cfg.c:'#CCC';
  ctx.font=`bold ${sel?13:12}px sans-serif`; ctx.textAlign='center';
  ctx.fillText(cfg.n,x+CW/2,y+CH*0.70);
  const bx=x+10, bw=CW-20, by=y+CH*0.75, bh=5, g=10;
  mBar(bx,by,      bw,bh,cfg.hp/10,  '#E74C3C');
  mBar(bx,by+g,    bw,bh,cfg.as/2.5, '#F39C12');
  mBar(bx,by+g*2,  bw,bh,cfg.dm/5,   '#9B59B6');
}

function mBar(x,y,w,h,p,col){
  ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.fillRect(x,y,w,h);
  ctx.fillStyle=col; ctx.fillRect(x,y,w*Math.min(p,1),h);
}
