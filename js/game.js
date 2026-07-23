const MELEE_DIST = PX + 106; // where enemies stop and fight

function startGame(){
  navTab='game';
  const cfg=CHAR[selC];
  pl={char:selC,cfg,state:'run',fr:0,ft:0,hp:cfg.hp,mhp:cfg.hp,al:false,ht:0};
  en=[]; pt=[];
  curBG=LOCATIONS[curLoc].bg;
  bgO=Array(4).fill(0); bgCT=0;
  gspd=LOCATIONS[curLoc].spd;
  sc=0; spT=1800; dst=0;
  ST='PLAY';
}

function updGame(dt){
  if(pl.hp<=0){if(sc>bestScore)bestScore=sc;gamesPlayed++;ST='GAMEOVER';goT=0;return;}

  const bgCfg=BG_CONFIG[BGS[curBG]];
  if(pl.state==='run') bgO=bgO.map((o,i)=>(o+bgCfg.speeds[i]*gspd*dt/16)%VW);

  spT-=dt;
  if(spT<=0){ spawn(); spT=Math.max(900,2600-curLoc*250)+Math.random()*600; }

  // Alive enemies sorted by x ascending (smallest x = closest to player)
  const alive=en.filter(e=>e.hp>0).sort((a,b)=>a.x-b.x);

  alive.forEach((e,idx)=>{
    const et=ET[e.tp];
    const stopX=idx===0 ? MELEE_DIST : alive[idx-1].x+68+et.s*18;

    if(e.x>stopX){
      e.x-=et.v*gspd*dt/16;
      if(e.x<stopX) e.x=stopX;
    }

    // Front enemy attacks player
    if(idx===0 && e.x<=MELEE_DIST+4){
      e.at=(e.at||0)+dt;
      if(e.at>=et.ai){
        e.at=0;
        pl.hp=Math.max(0,pl.hp-et.ad);
        pl.ht=380;
        dmg(PX+20,GY-70,'−'+et.ad,'#E74C3C');
      }
    }
  });

  // Dead enemy timers
  en.forEach(e=>{ if(e.hp<=0) e.dt=(e.dt||0)+dt; });

  // Player: start attacking when nearest enemy in range
  const nr=alive[0];
  if(nr&&nr.x-PX<VW*0.40&&pl.state==='run'){pl.state='attack';pl.fr=0;pl.ft=0;pl.al=false;}

  const cfg=pl.cfg;
  const fd=pl.state==='attack'?52/cfg.as:78;
  pl.ft+=dt;
  if(pl.ft>=fd){
    pl.ft-=fd;
    const ad=imgs.ch[pl.char][pl.state];
    const mf=ad.f, hf=Math.floor(mf*0.55);
    if(pl.state==='attack'&&pl.fr===hf&&!pl.al){
      pl.al=true;
      if(nr&&nr.hp>0&&nr.x-PX<VW*0.44){
        const crit=Math.random()<0.15, d=cfg.dm*(crit?2:1);
        nr.hp-=d;
        dmg(nr.x,GY-nr.s*VH*0.19,crit?'⚡'+d:String(d),crit?'#FFD700':'#FFF');
        sparks(nr.x,GY-nr.s*VH*0.14);
        if(nr.hp<=0){sc+=nr.xp;xp+=nr.xp*2;gold+=Math.ceil(nr.xp*1.5);totalKills++;nr.dt=0;checkLv();}
      }
    }
    pl.fr++;
    if(pl.fr>=mf){
      pl.fr=0; pl.al=false;
      const still=alive.find(e=>e.x-PX<VW*0.40);
      if(!still) pl.state='run';
    }
  }

  if(pl.ht>0) pl.ht-=dt;
  en=en.filter(e=>!((e.hp<=0&&(e.dt||0)>650)||e.x<PX-160));
  pt.forEach(p=>{
    p.x+=(p.vx||0)*dt/16; p.y+=(p.vy||0)*dt/16;
    if(p.tp==='sp') p.vy+=0.25;
    p.l-=dt/p.ml;
  });
  pt=pt.filter(p=>p.l>0);
}

function spawn(){
  const loc=LOCATIONS[curLoc];
  const minT=Math.max(0,curLoc-1);
  const maxT=Math.min(ET.length-1,curLoc);
  const tp=minT+Math.floor(Math.random()*(maxT-minT+1));
  const et=ET[tp];
  const hp2=Math.max(1,Math.round(et.hp*loc.hpMult));
  const xp2=Math.round(et.xp*loc.xpMult);
  en.push({x:VW+80+Math.random()*30,tp,hp:hp2,mhp:hp2,v:et.v,s:et.s,xp:xp2,at:0});
}

function checkLv(){
  while(plLv<XP_TO_LV.length&&xp>=XP_TO_LV[plLv]) plLv++;
}

function dmg(x,y,txt,col){
  pt.push({tp:'tx',x,y,txt,col,vy:-1.6,vx:(Math.random()-0.5)*1.2,l:1,ml:850,sz:19});
}

function sparks(x,y){
  for(let i=0;i<7;i++){
    const a=Math.random()*Math.PI*2, s=3+Math.random()*5;
    pt.push({tp:'sp',x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-2,
      col:['#FF4500','#FF8C00','#FFD700','#FFF'][0|Math.random()*4],l:1,ml:500,sz:2+Math.random()*3});
  }
}
