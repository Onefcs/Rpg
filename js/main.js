window.onload=()=>{
  canvas=document.getElementById('c');
  ctx=canvas.getContext('2d');
  resize();
  window.addEventListener('resize',resize);
  canvas.addEventListener('pointerup',e=>tap(e.clientX,e.clientY));
  document.addEventListener('keydown',e=>{
    if(e.code==='Space')tap(
      VW*dsc/2+canvas.getBoundingClientRect().left,
      VH*dsc/2+canvas.getBoundingClientRect().top
    );
  });
  load();
};

function resize(){
  const sw=window.innerWidth, sh=window.innerHeight;
  isPortrait=sh>sw;
  if(isPortrait){
    // Canvas is portrait-shaped (VH wide × VW tall), no CSS rotation needed.
    // The draw loop rotates the ctx internally so game content appears upright.
    dsc=Math.min(sw/VH, sh/VW);
    canvas.width=VH; canvas.height=VW;
    const dw=VH*dsc, dh=VW*dsc;
    Object.assign(canvas.style,{
      width:dw+'px', height:dh+'px', position:'absolute',
      left:(sw-dw)/2+'px', top:(sh-dh)/2+'px',
      transform:'', transformOrigin:''
    });
  }else{
    dsc=Math.min(sw/VW,sh/VH);
    canvas.width=VW; canvas.height=VH;
    const dw=VW*dsc, dh=VH*dsc;
    Object.assign(canvas.style,{
      width:dw+'px', height:dh+'px', position:'absolute',
      left:(sw-dw)/2+'px', top:(sh-dh)/2+'px',
      transform:'', transformOrigin:''
    });
  }
}

function loop(t){
  requestAnimationFrame(loop);
  const dt=Math.min(t-lastT,50); lastT=t;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // In portrait the canvas is 540×960. Rotate context so the landscape
  // game (960×540) draws upright filling the portrait canvas.
  if(isPortrait){ctx.save();ctx.translate(0,VW);ctx.rotate(-Math.PI/2);}
  if(ST==='LOADING')      drawLoad();
  else if(ST==='SELECT')  {updSel(dt);drawSel();}
  else if(ST==='PLAY')    {updGame(dt);drawGame();}
  else                     drawOver(dt);
  if(isPortrait) ctx.restore();
}

function drawLoad(){
  ctx.fillStyle='#08080F'; ctx.fillRect(0,0,VW,VH);
  const p=tot>0?ldn/tot:0, bw=VW*0.5, bh=16, bx=(VW-bw)/2, by=VH/2;
  ctx.fillStyle='#1A1A2E'; ctx.fillRect(bx,by,bw,bh);
  ctx.fillStyle='#F39C12'; ctx.fillRect(bx,by,bw*p,bh);
  ctx.strokeStyle='#F39C12'; ctx.lineWidth=1.5; ctx.strokeRect(bx,by,bw,bh);
  ctx.fillStyle='#EEE'; ctx.font='bold 18px sans-serif'; ctx.textAlign='center';
  ctx.fillText('Загрузка '+Math.round(p*100)+'%',VW/2,by-12);
  ctx.font='bold 42px sans-serif'; ctx.fillStyle='#F39C12';
  ctx.fillText('HERO RUNNER',VW/2,VH*0.4);
}
