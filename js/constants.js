const VW=960, VH=540;
const GY=VH*0.80;
const PX=VW*0.16;

const BGS=['BG_01','BG_02','BG_03','BG_04'];

const BG_CONFIG={
  BG_01:{
    layers:['sky','mountains_bg','clouds','mountains_fg','fog','dust','ground','cactus'],
    speeds:[0.02,0.05,0.10,0.20,0.32,0.55,0.85,1.10]
  },
  BG_02:{
    layers:['sky','stars','mountains_bg','clouds_bg','mountains_mg','mountains_fg','tree','clouds_fg','ground'],
    speeds:[0.02,0.03,0.06,0.10,0.18,0.28,0.45,0.68,1.10]
  },
  BG_03:{
    layers:['sky','clouds_bg','mountain','forest_and_mountains','clouds_fg','fog','tree','forest_fg','ground'],
    speeds:[0.02,0.06,0.10,0.16,0.24,0.34,0.50,0.75,1.10]
  },
  BG_04:{
    layers:['sky','sun','clouds_bg','mountains_bg','mountains_mg','fog','mountains_fg','cloud_fg','ground'],
    speeds:[0.02,0.03,0.07,0.12,0.22,0.32,0.48,0.70,1.10]
  },
};
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
