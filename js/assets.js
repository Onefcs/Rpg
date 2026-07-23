function load(){
  tot=CORD.length*3;
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
