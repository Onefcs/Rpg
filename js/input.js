function tap(cx,cy){
  const r=canvas.getBoundingClientRect();
  let tx, ty;
  if(isPortrait){
    const dx=cx-r.left, dy=cy-r.top;
    tx=dy/dsc; ty=(r.width-dx)/dsc;
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
