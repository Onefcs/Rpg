const VW=960, VH=540;
const GY=VH*0.80;
const PX=VW*0.16;

const LAYERS=['Sky','BG_Decor','Middle_Decor','Ground_02','Ground_01','Foreground'];
const LSPD  =[0.04, 0.12,    0.25,          0.45,       0.72,      1.10];
const BGS   =['BG_01','BG_02','BG_03','BG_04'];
const CORD  =['warrior','mage','archer','assasin','zhnec'];

const CHAR={
  warrior:{n:'Воин',    c:'#E74C3C', hp:8,  as:1.0, dm:3, sc:2.30, idle:5, run:7, attack:5},
  mage:   {n:'Маг',     c:'#3498DB', hp:4,  as:1.8, dm:2, sc:2.30, idle:5, run:8, attack:7},
  archer: {n:'Лучник',  c:'#2ECC71', hp:6,  as:1.4, dm:2, sc:1.82, idle:14,run:8, attack:11},
  assasin:{n:'Ассасин', c:'#9B59B6', hp:5,  as:2.0, dm:2, sc:1.52, idle:5, run:8, attack:6},
  zhnec:  {n:'Рыцарь',  c:'#F39C12', hp:10, as:0.8, dm:4, sc:1.35, idle:8, run:8, attack:8},
};

const ET=[
  {n:'Гоблин', hp:3,  c:'#C0392B', e:'#F1C40F', s:0.60, v:1.2, xp:1},
  {n:'Орк',    hp:7,  c:'#1E8449', e:'#E74C3C', s:0.95, v:0.8, xp:3},
  {n:'Тролль', hp:14, c:'#6C3483', e:'#1ABC9C', s:1.25, v:0.5, xp:7},
  {n:'Демон',  hp:28, c:'#0D0D0D', e:'#FF4500', s:1.55, v:0.6, xp:15},
];

const CW=158, CH=228, CG=14;
const CX0=(VW-(CORD.length*(CW+CG)-CG))/2;
const CY=128;
