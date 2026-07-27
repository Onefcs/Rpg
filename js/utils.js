function rR(x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}

// ─── Telegram-style GUI primitives ────────────────────────────────────────────

// Thin hairline row divider, inset from the edges like a Telegram list.
function tgDivider(x,y,w){
  ctx.fillStyle=TG.divider; ctx.fillRect(x,y,w,1);
}

// Rounded-square accent icon tile (Telegram Settings-app style).
function tgIconTile(x,y,s,col,glyph,fontSize){
  rR(x,y,s,s,s*0.32); ctx.fillStyle=col; ctx.fill();
  ctx.fillStyle='#FFF'; ctx.font=(fontSize||Math.round(s*0.52))+'px sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(glyph, x+s/2, y+s/2+1);
  ctx.textBaseline='alphabetic';
}

// Solid Telegram-blue pill button with centered label.
function tgButton(x,y,w,h,label,enabled,col){
  const c=col||TG.blue;
  rR(x,y,w,h,h/2);
  ctx.fillStyle=enabled===false?'rgba(255,255,255,0.06)':c;
  ctx.fill();
  ctx.fillStyle=enabled===false?TG.txt3:'#FFFFFF';
  ctx.font='bold '+Math.round(h*0.42)+'px sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(label, x+w/2, y+h/2+1);
  ctx.textBaseline='alphabetic';
}

// Small blue circular checkmark (Telegram "read"/done indicator).
function tgCheck(cx,cy,r,col){
  ctx.save();
  ctx.fillStyle=col||TG.blue;
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#FFF'; ctx.lineWidth=Math.max(1.4,r*0.24); ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.beginPath();
  ctx.moveTo(cx-r*0.45,cy+r*0.02); ctx.lineTo(cx-r*0.12,cy+r*0.38); ctx.lineTo(cx+r*0.48,cy-r*0.32);
  ctx.stroke();
  ctx.restore();
}
