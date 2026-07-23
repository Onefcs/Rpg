function load(){
  const bgLayerCount=BGS.reduce((s,bg)=>s+BG_CONFIG[bg].layers.length,0);
  tot=bgLayerCount+CORD.length*3;
  BGS.forEach(bg=>{
    imgs.bg[bg]={};
    BG_CONFIG[bg].layers.forEach(layer=>{
      const im=new Image(); im.onload=onl;
      im.src=`assets/bg/${bg}/${layer}.png`;
      imgs.bg[bg][layer]=im;
    });
  });
  CORD.forEach(c=>{
    imgs.ch[c]={};
    ['idle','run','attack'].forEach(a=>{
      const d=SPRITE_META[c][a], im=new Image(); im.onload=onl;
      im.src=`assets/chars/${c}/${a}.png`;
      imgs.ch[c][a]={im,f:d.f,w:d.w,h:d.h,tw:d.tw,th:d.th,tx:d.tx,ty:d.ty};
    });
  });
}

function onl(){
  ldn++;
  if(ldn>=tot){ST='SELECT';initSel();}
}
