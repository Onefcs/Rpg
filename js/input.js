function tap(cx,cy){
  const r=canvas.getBoundingClientRect();
  const tx=(cx-r.left)/dsc;
  const ty=(cy-r.top)/dsc;
  if(ty>VH-NAV_H){
    const ti=Math.floor(tx/(VW/NAV_TABS.length));
    if(ti>=0&&ti<NAV_TABS.length){navTab=NAV_TABS[ti];return;}
  }
  if(navTab==='inventory'){
    const y0=HDR_H+52, slotH=50, slotGap=5;
    const gridEnd=y0+5*slotH+4*slotGap;
    const cardsY=gridEnd+26;
    const cw=(VW-28)/3, ch=70, cg=4;
    const statKeys=['hp','dm','df','as','cc','cr'];
    statKeys.forEach((sk,i)=>{
      const col=i%3, row=Math.floor(i/3);
      const cx=10+col*(cw+cg), cy=cardsY+row*(ch+cg);
      if(tx>=cx&&tx<=cx+cw&&ty>=cy+ch-24&&ty<=cy+ch-4){
        const lv=statUpgrades[sk]||0;
        const cost=Math.round((UPGRADE_BASE_COST[sk]||50)*Math.pow(1.5,lv));
        if(gold>=cost){gold-=cost;statUpgrades[sk]=(statUpgrades[sk]||0)+1;}
      }
    });
    return;
  }
  if(navTab==='map'){
    const unlockAt=[0,10,50,200];
    const cardH=152, cardGap=8, startY=HDR_H+56;
    LOCATIONS.forEach((loc,i)=>{
      const cy=startY+i*(cardH+cardGap);
      if(ty>=cy&&ty<=cy+cardH&&tx>=10&&tx<=VW-10&&totalKills>=unlockAt[i]) curLoc=i;
    });
    return;
  }
  if(navTab!=='game') return;
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
