const MELEE_DIST = PX + 106;

function eff(){
  const base=CHAR[selC];
  const u=statUpgrades;
  let dm=base.dm + u.dm*0.5;
  let hp=base.hp + u.hp*2;
  let df=(base.df||0) + u.df*0.5;
  let as=base.as + u.as*0.1;
  let cc=(base.cc||0.15) + u.cc*0.02;
  let cr=(base.cr||2.0) + u.cr*0.15;
  Object.values(equipped).forEach(item=>{
    if(!item) return;
    (SLOT_BONUS[item.slot]||[]).forEach(b=>{
      const v=b.base*(item.rarity+1)*0.8;
      if(b.stat==='dm')      dm+=v;
      else if(b.stat==='hp') hp+=v;
      else if(b.stat==='df') df+=v;
      else if(b.stat==='as') as+=v;
      else if(b.stat==='cc') cc+=v;
      else if(b.stat==='cr') cr+=v;
    });
  });
  return {
    dm: Math.max(1,dm),
    hp: Math.max(1,Math.round(hp)),
    df: Math.max(0,df),
    as: Math.max(0.3,as),
    cc: Math.min(0.95,cc),
    cr: Math.max(1.5,cr),
  };
}

function startGame(){
  navTab='game';
  const e=eff();
  const cfg=CHAR[selC];
  pl={char:selC,cfg,state:'run',fr:0,ft:0,hp:e.hp,mhp:e.hp,al:false,ht:0};
  en=[]; pt=[];
  curBG=LOCATIONS[curLoc].bg;
  bgO=Array(4).fill(0); bgCT=0;
  gspd=LOCATIONS[curLoc].spd;
  sc=0; spT=1800; dst=0;
  ST='PLAY';
}

function updGame(dt){
  if(pl.hp<=0){if(sc>bestScore)bestScore=sc;gamesPlayed++;ST='GAMEOVER';goT=0;return;}

  const es=eff();
  const bgCfg=BG_CONFIG[BGS[curBG]];
  if(pl.state==='run') bgO=bgO.map((o,i)=>(o+bgCfg.speeds[i]*gspd*dt/16)%VW);

  spT-=dt;
  if(spT<=0){ spawn(); spT=Math.max(900,2600-curLoc*250)+Math.random()*600; }

  const alive=en.filter(e=>e.hp>0).sort((a,b)=>a.x-b.x);

  alive.forEach((e,idx)=>{
    const et=ET[e.tp];
    const stopX=idx===0 ? MELEE_DIST : alive[idx-1].x+68+et.s*18;

    if(e.x>stopX){
      e.x-=et.v*gspd*dt/16;
      if(e.x<stopX) e.x=stopX;
    }

    if(idx===0 && e.x<=MELEE_DIST+4){
      e.at=(e.at||0)+dt;
      if(e.at>=et.ai){
        e.at=0;
        const taken=Math.max(1,Math.round(et.ad-es.df));
        pl.hp=Math.max(0,pl.hp-taken);
        pl.ht=380;
        dmg(PX+20,GY-70,'−'+taken,'#E74C3C');
      }
    }
  });

  en.forEach(e=>{ if(e.hp<=0) e.dt=(e.dt||0)+dt; });

  const nr=alive[0];
  if(nr&&nr.x-PX<VW*0.40&&pl.state==='run'){pl.state='attack';pl.fr=0;pl.ft=0;pl.al=false;}

  const fd=pl.state==='attack'?52/es.as:78;
  pl.ft+=dt;
  if(pl.ft>=fd){
    pl.ft-=fd;
    const ad=imgs.ch[pl.char][pl.state];
    const mf=ad.f, hf=Math.floor(mf*0.55);
    if(pl.state==='attack'&&pl.fr===hf&&!pl.al){
      pl.al=true;
      if(nr&&nr.hp>0&&nr.x-PX<VW*0.44){
        const crit=Math.random()<es.cc, d=Math.round(es.dm*(crit?es.cr:1));
        nr.hp-=d;
        dmg(nr.x,GY-nr.s*VH*0.19,crit?'⚡'+d:String(d),crit?'#FFD700':'#FFF');
        sparks(nr.x,GY-nr.s*VH*0.14);
        if(nr.hp<=0){
          sc+=nr.xp;xp+=nr.xp*2;gold+=Math.ceil(nr.xp*1.5);
          totalKills++;nr.dt=0;checkLv();tryDrop(nr);
        }
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

function tryDrop(e){
  if(Math.random()>0.22+curLoc*0.07) return;
  const weights=[50,28,15,6,1];
  let roll=Math.random()*100, ri=0;
  for(let i=0;i<weights.length;i++){if(roll<weights[i]){ri=i;break;}roll-=weights[i];}
  const slot=SLOT_TYPES[Math.floor(Math.random()*SLOT_TYPES.length)];
  const item={slot,rarity:ri,name:ITEM_NAMES[slot][ri]};
  if(!equipped[slot]||ri>=equipped[slot].rarity){
    equipped[slot]=item;
    lastDrop={item,t:performance.now()};
    dmg(e.x,GY-e.s*VH*0.32,RARITIES[ri].n+'!',RARITIES[ri].col);
  }
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
