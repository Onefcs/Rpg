function tap(cx,cy){
  const r=canvas.getBoundingClientRect();
  let tx, ty;
  if(isPortrait){
    // Canvas is portrait (VH×VW = 540×960), drawn via ctx.translate(0,VW)+rotate(-90°).
    // Inverse transform: portrait canvas pixel (px,py) → landscape game (tx,ty):
    //   tx = VW - py,  ty = px
    const px=(cx-r.left)/dsc;
    const py=(cy-r.top)/dsc;
    tx=VW-py; ty=px;
  }else{
    tx=(cx-r.left)/dsc; ty=(cy-r.top)/dsc;
  }
  if(ST==='SELECT'){
    let hit=null;
    CORD.forEach((c,i)=>{
      const x=CX0+i*(CW+CG);
      if(tx>=x&&tx<=x+CW&&ty>=CY&&ty<=CY+CH) hit=c;
    });
    if(hit){if(selC===hit) startGame(); else selC=hit;}
    else if(selC&&ty>CY+CH) startGame();
  }else if(ST==='GAMEOVER'){
    goT=0; ST='SELECT'; initSel();
  }
}
