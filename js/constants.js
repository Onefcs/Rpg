// Portrait-native internal resolution (9:16)
const VW=540, VH=960;
const GY=VH*0.84;
const PX=VW*0.18;

const BGS=['BG_01','BG_02','BG_03','BG_04'];

// speeds[4] is the new far-sky "epic" layer (floating islands / dragon / ruins) —
// slower than speeds[0] so it reads as farther away than the back mountains.
const BG_CONFIG={
  BG_01:{speeds:[0.05, 0.15, 0.55, 1.10, 0.020]},
  BG_02:{speeds:[0.04, 0.12, 0.45, 1.10, 0.015]},
  BG_03:{speeds:[0.05, 0.14, 0.50, 1.10, 0.022]},
  BG_04:{speeds:[0.06, 0.18, 0.48, 1.10, 0.028]},
};

// Ambient scene-light tint applied to the player sprite (source-atop, cheap
// per-pixel-shape recolor) so the hero visually sits inside each backdrop.
const BG_TINT={
  BG_01:'rgba(255,150,60,0.16)',
  BG_02:'rgba(90,120,210,0.22)',
  BG_03:'rgba(210,255,220,0.09)',
  BG_04:'rgba(255,70,60,0.20)',
};

const CORD=['warrior','mage','archer','assasin','zhnec'];

// Sprite metadata: f=frames, w=sheet width, h=frame height,
// tx/ty=offset of trimmed region inside raw frame, tw/th=trimmed size
const SPRITE_META={
  assasin:{
    idle:  {f:5,  w:480,  h:96,  tx:30, ty:29, tw:29, th:37},
    run:   {f:8,  w:768,  h:96,  tx:31, ty:24, tw:33, th:42},
    attack:{f:6,  w:576,  h:96,  tx:4,  ty:21, tw:92, th:45},
  },
  mage:{
    idle:  {f:5,  w:480,  h:64,  tx:37, ty:16, tw:35, th:35},
    run:   {f:8,  w:768,  h:64,  tx:33, ty:15, tw:51, th:36},
    attack:{f:7,  w:672,  h:64,  tx:19, ty:10, tw:76, th:41},
  },
  warrior:{
    idle:  {f:5,  w:480,  h:64,  tx:34, ty:13, tw:24, th:35},
    run:   {f:7,  w:672,  h:64,  tx:35, ty:15, tw:35, th:33},
    attack:{f:5,  w:480,  h:64,  tx:13, ty:6,  tw:80, th:42},
  },
  archer:{
    idle:  {f:14, w:1344, h:80,  tx:16, ty:24, tw:53, th:40},
    run:   {f:8,  w:768,  h:80,  tx:26, ty:21, tw:38, th:43},
    attack:{f:11, w:1056, h:80,  tx:3,  ty:22, tw:93, th:42},
  },
  zhnec:{
    idle:  {f:6,  w:768,  h:108, tx:49, ty:44, tw:40, th:52},
    run:   {f:8,  w:1024, h:108, tx:34, ty:49, tw:55, th:51},
    attack:{f:6,  w:768,  h:108, tx:29, ty:38, tw:84, th:58},
  },
};

const CHAR={
  warrior:{n:'Воин',    cl:'Ближний бой', c:'#E74C3C', hp:8,  as:1.0, dm:3, df:1.0, cc:0.10, cr:2.0, sc:2.40},
  mage:   {n:'Маг',     cl:'Магия',       c:'#3498DB', hp:4,  as:1.8, dm:2, df:0.0, cc:0.20, cr:2.5, sc:2.40},
  archer: {n:'Лучник',  cl:'Стрелок',     c:'#2ECC71', hp:6,  as:1.4, dm:2, df:0.5, cc:0.25, cr:2.0, sc:1.90},
  assasin:{n:'Ассасин', cl:'Скрытность',  c:'#9B59B6', hp:5,  as:2.0, dm:2, df:0.0, cc:0.30, cr:2.5, sc:1.65},
  zhnec:  {n:'Рыцарь',  cl:'Защита',      c:'#F39C12', hp:10, as:0.8, dm:4, df:2.0, cc:0.05, cr:1.8, sc:1.45},
};

const ET=[
  {n:'Гоблин', hp:3,  c:'#C0392B', e:'#F1C40F', s:0.60, v:1.2, xp:1,  ad:1, ai:1400},
  {n:'Орк',    hp:7,  c:'#1E8449', e:'#E74C3C', s:0.95, v:0.8, xp:3,  ad:2, ai:1800},
  {n:'Тролль', hp:14, c:'#6C3483', e:'#1ABC9C', s:1.25, v:0.5, xp:7,  ad:3, ai:2400},
  {n:'Демон',  hp:28, c:'#0D0D0D', e:'#FF4500', s:1.55, v:0.6, xp:15, ad:5, ai:1600},
];

const LOCATIONS=[
  {n:'Зелёный лес',          icon:'🌲', bg:2, tier:1, hpMult:1.0,  xpMult:1.0, spd:3.5},
  {n:'Тёмные холмы',          icon:'⛰', bg:1, tier:2, hpMult:2.5,  xpMult:2.0, spd:4.5},
  {n:'Вулканические равнины', icon:'🌋', bg:0, tier:3, hpMult:6.0,  xpMult:4.0, spd:5.5},
  {n:'Проклятые земли',       icon:'💀', bg:3, tier:4, hpMult:14.0, xpMult:8.0, spd:7.0},
];

const RARITIES=[
  {n:'Обычный',     col:'#9E9E9E', wt:50},
  {n:'Необычный',   col:'#4CAF50', wt:28},
  {n:'Редкий',      col:'#2196F3', wt:15},
  {n:'Эпический',   col:'#9C27B0', wt:6},
  {n:'Легендарный', col:'#FF9800', wt:1},
];

const SLOT_TYPES  =['weapon','helmet','body','legs','gloves','boots','ring','necklace','belt','pet'];
const SLOT_LABELS =['Оружие','Шлем','Тело','Ноги','Перчатки','Ботинки','Кольцо','Ожерелье','Пояс','Питомец'];
const SLOT_ICONS  =['⚔','⛑','🛡','👖','🧤','👟','💍','📿','🔗','🐾'];

const SLOT_BONUS={
  weapon:  [{stat:'dm', base:1.2}],
  helmet:  [{stat:'hp', base:2.0}],
  body:    [{stat:'hp', base:1.5},{stat:'df',base:0.8}],
  legs:    [{stat:'df', base:1.0}],
  gloves:  [{stat:'cc', base:0.03}],
  boots:   [{stat:'as', base:0.2}],
  ring:    [{stat:'cr', base:0.3}],
  necklace:[{stat:'dm', base:0.8},{stat:'hp',base:1.5}],
  belt:    [{stat:'df', base:0.8}],
  pet:     [{stat:'dm', base:0.6}],
};

const ITEM_NAMES={
  weapon:  ['Нож','Кинжал','Меч','Топор','Клинок судьбы'],
  helmet:  ['Шапка','Шлем','Наголовник','Корона','Венец Героя'],
  body:    ['Рубаха','Броня','Кираса','Доспех','Латы Богов'],
  legs:    ['Штаны','Поножи','Набедренник','Кюлоты','Поножи Богов'],
  gloves:  ['Краги','Перчатки','Латные краги','Рукавицы','Перчатки Теней'],
  boots:   ['Сапоги','Ботинки','Сандалии','Поножи','Сапоги Ветра'],
  ring:    ['Кольцо','Перстень','Печатка','Кольцо Силы','Перстень Судьбы'],
  necklace:['Амулет','Ожерелье','Медальон','Кулон','Ожерелье Богов'],
  belt:    ['Пояс','Ремень','Кушак','Перевязь','Пояс Силы'],
  pet:     ['Котёнок','Щенок','Ворон','Дракончик','Феникс'],
};

const UPGRADE_BASE_COST={hp:30, dm:50, df:40, as:70, cc:100, cr:80};
const STAT_LABELS={hp:'❤ HP', dm:'⚔ Атака', df:'🛡 Защита', as:'⚡ Ск.атаки', cc:'🎯 Крит%', cr:'💥 Крит×'};
const STAT_DISP  ={hp:'HP',   dm:'АТК',      df:'ЗАЩ',       as:'СКР',         cc:'КРТ%',     cr:'КРТ×'};

const CW=90, CH=148, CG=7;
const CX0=(VW-(CORD.length*(CW+CG)-CG))/2;
const CY=220;

const HDR_H=90, NAV_H=72;
const NAV_TABS=['game','inventory','map','quests','profile'];
const NAV_LABELS=['Игра','Инвентарь','Карта','Квесты','Профиль'];
const NAV_ICONS=['⚔','🎒','🗺','📜','👑'];
const XP_TO_LV=[0,40,100,200,350,560,840,1200,1700,2400];
