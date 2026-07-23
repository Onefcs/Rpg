function load(){
  tot=BGS.length*LAYERS.length+CORD.length*3;
  BGS.forEach(bg=>{
    imgs.bg[bg]={};
    LAYERS.forEach(layer=>{
      const im=new Image(); im.onload=onl;
      im.src=`assets/bg/${bg}/${layer}.png`;
      imgs.bg[bg][layer]=im;
    });
  });
  fetch('assets/chars/sprites.json')
    .then(r=>r.json())
    .then(meta=>{
      CORD.forEach(c=>{
        imgs.ch[c]={};
        ['idle','run','attack'].forEach(a=>{
          const d=meta[c][a], im=new Image(); im.onload=onl;
          im.src=`assets/chars/${c}/${a}.png`;
          imgs.ch[c][a]={im, f:d.f, w:d.w, h:d.h};
        });
      });
    });
}

function onl(){
  ldn++;
  if(ldn>=tot){ST='SELECT';initSel();requestAnimationFrame(loop);}
}
