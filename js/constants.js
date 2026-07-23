// Internal game resolution (landscape) — ctx is rotated in portrait mode
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

const CORD=['warrior','mage','archer','assasin','zhnec'];

// Sprite metadata: f=frames, w=sheet width, h=frame height,
// tx/ty=offset of trimmed region inside raw frame, tw/th=trimmed size
const SPRITE_META={
  assasin:{
    idle:  {f:5,  w:480,  h:96,  tx:32, ty:29, tw:27, th:37},
    run:   {f:8,  w:768,  h:96,  tx:33, ty:24, tw:31, th:42},
    attack:{f:6,  w:576,  h:96,  tx:27, ty:21, tw:69, th:48},
  },
  mage:{
    idle:  {f:5,  w:480,  h:64,  tx:37, ty:16, tw:31, th:35},
    run:   {f:8,  w:768,  h:64,  tx:38, ty:15, tw:46, th:37},
    attack:{f:7,  w:672,  h:64,  tx:37, ty:10, tw:58, th:52},
  },
  warrior:{
    idle:  {f:5,  w:480,  h:64,  tx:37, ty:13, tw:21, th:35},
    run:   {f:7,  w:672,  h:64,  tx:35, ty:15, tw:33, th:33},
    attack:{f:5,  w:480,  h:64,  tx:30, ty:6,  tw:63, th:42},
  },
  archer:{
    idle:  {f:14, w:1344, h:80,  tx:28, ty:24, tw:41, th:40},
    run:   {f:8,  w:768,  h:80,  tx:32, ty:21, tw:32, th:43},
    attack:{f:11, w:1056, h:80,  tx:30, ty:22, tw:66, th:42},
  },
  zhnec:{
    idle:  {f:8,  w:768,  h:108, tx:0,  ty:44, tw:96, th:52},
    run:   {f:8,  w:1024, h:108, tx:34, ty:49, tw:54, th:53},
    attack:{f:8,  w:768,  h:108, tx:0,  ty:38, tw:96, th:63},
  },
};

const CHAR={
  warrior:{n:'Воин',    c:'#E74C3C', hp:8,  as:1.0, dm:3, sc:2.30},
  mage:   {n:'Маг',     c:'#3498DB', hp:4,  as:1.8, dm:2, sc:2.30},
  archer: {n:'Лучник',  c:'#2ECC71', hp:6,  as:1.4, dm:2, sc:1.82},
  assasin:{n:'Ассасин', c:'#9B59B6', hp:5,  as:2.0, dm:2, sc:1.52},
  zhnec:  {n:'Рыцарь',  c:'#F39C12', hp:10, as:0.8, dm:4, sc:1.35},
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
