type Layer='base'|'labels';

export default function AzaleasPlan({layer}:{layer:Layer}){
 if(layer==='base')return <g className="azaleas-plan plan-base" transform="scale(.6097560976)" aria-hidden="true">
  {/* Outer property boundary */}
  <path className="site-boundary" d="M105 12L1385 180L1304 386L1260 416L1220 500L1154 620L980 570L895 548L188 458L153 457L75 447L58 417L105 12Z"/>
  {/* Access road curve on right */}
  <path className="access-road" d="M1440 140Q1410 240 1330 420T1240 600"/>
  {/* Futura entrada */}
  <path className="future-entry" d="M245 31L312 39L304 110L235 101Z"/>
  {/* Pozo */}
  <path className="well" d="M819 106L878 114L870 185L810 176Z"/>
  {/* Parque with accurate shape and smooth curve */}
  <path className="park" d="M904 393L1048 417Q1068 428 1065 448Q1052 470 1008 520L980 546L910 536L895 534Z"/>
  {/* Entrada in block K */}
  <path className="entrance" d="M1178 427L1244 437Q1260 442 1258 457L1242 482L1226 502L1148 456Z"/>
 </g>;

 return <g className="azaleas-plan plan-labels" transform="scale(.6097560976)" aria-hidden="true">
  {/* Futura entrada label */}
  <g className="amenity-label future-entry-label">
   <text x="274" y="65">Futura</text>
   <text x="274" y="87">entrada</text>
  </g>
  {/* Pozo label */}
  <text className="amenity-title well-title" x="844" y="152">pozo</text>
  {/* Parque label */}
  <text className="amenity-title park-title" x="965" y="475">parque</text>
  {/* Entrada label */}
  <text className="amenity-title entrance-title" x="1210" y="470">entrada</text>

  {/* Block markers */}
  {/* Manzana A top row */}
  <g className="block-marker" transform="translate(641 95)"><circle r="18"/><text y="7">A</text></g>
  {/* Manzana A right block */}
  <g className="block-marker" transform="translate(1150 321)"><circle r="18"/><text y="7">A</text></g>
  {/* Manzana B */}
  <g className="block-marker" transform="translate(100 277)"><circle r="18"/><text y="7">B</text></g>
  {/* Manzana D */}
  <g className="block-marker" transform="translate(571 245)"><circle r="18"/><text y="7">D</text></g>
  {/* Manzana E */}
  <g className="block-marker" transform="translate(547 423)"><circle r="18"/><text y="7">E</text></g>
  {/* Manzana J and K stylized letters */}
  <text className="block-letter-jk" x="1092" y="500">J</text>
  <text className="block-letter-jk" x="1185" y="565">K</text>

  {/* North compass rose matching PDF */}
  <g className="north" transform="translate(1410 80)">
   <circle cx="0" cy="0" r="15"/>
   <line x1="0" y1="-21" x2="0" y2="-15"/>
   <line x1="0" y1="15" x2="0" y2="21"/>
   <line x1="-21" y1="0" x2="-15" y2="0"/>
   <line x1="15" y1="0" x2="21" y2="0"/>
   <polygon points="-7,-10 7,-10 0,-24" transform="rotate(-15)"/>
  </g>
 </g>;
}
