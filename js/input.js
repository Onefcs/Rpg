function tap(cx,cy){
  const r=canvas.getBoundingClientRect();
  const tx=(cx-r.left)/dsc;
  const ty=(cy-r.top)/dsc;
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
