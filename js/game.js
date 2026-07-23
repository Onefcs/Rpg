function startGame(){
  const cfg=CHAR[selC];
  pl={char:selC,cfg,state:'run',fr:0,ft:0,hp:cfg.hp,mhp:cfg.hp,al:false,ht:0};
  en=[]; pt=[]; curBG=0; bgCT=0;
  bgO=Array(4).fill(0);
  gspd=3.5; wave=1; sc=0; spT=2500; dst=0;
  ST='PLAY';
}

function updGame(dt){
  if(pl.hp<=0){ST='GAMEOVER';goT=0;return;}
  const bgCfg=BG_CONFIG[BGS[curBG]];
  if(pl.state==='run') bgO=bgO.map((o,i)=>(o+bgCfg.speeds[i]*gspd*dt/16)%VW);
  bgCT+=dt; if(bgCT>45000){bgCT=0;curBG=(curBG+1)%BGS.length;bgO=Array(4).fill(0);}
  dst+=dt; if(dst>8000){dst=0;gspd=Math.min(gspd+0.28,13);wave++;}
  spT-=dt; if(spT<=0){spawn();spT=Math.max(1100,3400-wave*140)+Math.random()*700;}

  const nr=en.filter(e=>e.hp>0&&e.x>PX-30).sort((a,b)=>a.x-b.x)[0];

  en.forEach(e=>{
    if(e.hp<=0){e.dt=(e.dt||0)+dt;return;}
    if(!(e===nr&&pl.state==='attack')) e.x-=e.v*gspd*dt/16;
    if(e.x<PX-36&&!e.hp0){e.hp0=true;pl.hp=Math.max(0,pl.hp-1);pl.ht=480;dmg(PX+20,GY-70,'−1','#E74C3C');}
  });

  if(nr&&nr.x-PX<VW*0.36&&pl.state==='run'){pl.state='attack';pl.fr=0;pl.ft=0;pl.al=false;}

  const cfg=pl.cfg;
  const fd=pl.state==='attack'?52/cfg.as:78;
  pl.ft+=dt;
  if(pl.ft>=fd){
    pl.ft-=fd;
    const ad=imgs.ch[pl.char][pl.state];
    const mf=ad.f, hf=Math.floor(mf*0.55);
    if(pl.state==='attack'&&pl.fr===hf&&!pl.al){
      pl.al=true;
      if(nr&&nr.hp>0&&nr.x-PX<VW*0.42){
        const crit=Math.random()<0.15, d=cfg.dm*(crit?2:1);
        nr.hp-=d;
        dmg(nr.x,GY-nr.s*VH*0.19,crit?'⚡'+d:String(d),crit?'#FFD700':'#FFF');
        sparks(nr.x,GY-nr.s*VH*0.14);
        if(nr.hp<=0){sc+=nr.xp;nr.dt=0;}
      }
    }
    pl.fr++;
    if(pl.fr>=mf){
      pl.fr=0; pl.al=false;
      const st=en.find(e=>e.hp>0&&e.x>PX-30&&e.x-PX<VW*0.36);
      if(!st) pl.state='run';
    }
  }
  if(pl.ht>0) pl.ht-=dt;
  en=en.filter(e=>!((e.hp<=0&&(e.dt||0)>650)||e.x<PX-140));
  pt.forEach(p=>{
    p.x+=(p.vx||0)*dt/16; p.y+=(p.vy||0)*dt/16;
    if(p.tp==='sp') p.vy+=0.25;
    p.l-=dt/p.ml;
  });
  pt=pt.filter(p=>p.l>0);
}

function spawn(){
  const wm=Math.floor(wave/3);
  const wt=[Math.max(0,10-wm*3),Math.max(0,6-wm),Math.max(0,4-wm*0.5|0),Math.min(wm*1.5,6)];
  const tot2=wt.reduce((s,w)=>s+w,0);
  let r=Math.random()*tot2, tp=0;
  for(let i=0;i<wt.length;i++){r-=wt[i];if(r<=0){tp=i;break;}}
  const et=ET[tp], hp2=et.hp+wave;
  en.push({x:VW+60,tp,hp:hp2,mhp:hp2,v:et.v,s:et.s,xp:et.xp+Math.floor(wave/3)});
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
