type Layer='base'|'labels';

export default function AzaleasPlan({layer}:{layer:Layer}){
 if(layer==='base')return <g className="azaleas-plan plan-base" transform="scale(.6097560976)" aria-hidden="true">
  <path className="site-boundary" d="M70 8L1380 153L1395 195L1304 386L1260 416L1079 604L1008 586L895 548L188 458L153 457L75 447L58 417L105 12Z"/>
  <path className="road" d="M92 91L1195 209L1190 244L88 127Z"/>
  <path className="road" d="M190 274L1100 389L1088 420L184 305Z"/>
  <path className="road" d="M82 104L203 118L196 151L79 138Z"/>
  <path className="road" d="M1055 387L1111 393L1073 452L1032 447Z"/>
  <path className="road" d="M1182 210L1245 216L1201 418L1164 413Z"/>
  <path className="future-entry" d="M244 30L312 38L304 108L235 100Z"/>
  <path className="well" d="M810 96L878 105L869 176L801 167Z"/>
<path className="park" d="M885 394L938 406Q950 410 950 438Q948 494 947 518Q946 528 936 524L896 522Q885 520 885 502L885 428Q885 402 885 394Z"/>
    <path className="entrance" d="M1162 421L1246 424L1224 448L1162 446Z"/>
    <path className="access-road" d="M1391 131Q1359 219 1325 296T1231 583"/>
    <path className="block-guide" d="M107 12L1195 155L1189 225L93 86Z"/>
   <path className="block-guide" d="M201 129L1097 243L1085 386L191 272Z"/>
   <path className="block-guide" d="M199 301L913 391L895 535L182 444Z"/>
   <path className="block-guide" d="M116 117L77 446L155 457L191 128Z"/>
   <path className="block-guide" d="M1088 421L1008 543L1068 582L1158 435Z"/>
   <path className="block-guide" d="M1148 456L1068 582L1154 604L1251 501Z"/>
  </g>;
  return <g className="azaleas-plan plan-labels" transform="scale(.6097560976)" aria-hidden="true">
   <g className="amenity-label"><text x="274" y="62">FUTURA</text><text x="274" y="83">ENTRADA</text></g>
<text className="amenity-title" x="839" y="139">POZO</text>
    <text className="amenity-title" x="918" y="472">PARQUE</text>
    <text className="amenity-title entrance-title" x="1204" y="426">ENTRADA</text>
   <text className="road-name" x="585" y="122">CALLE PRINCIPAL</text>
   <text className="road-name" x="590" y="320">CALLE INTERIOR</text>
  <g className="block-marker" transform="translate(640 78)"><circle r="23"/><text y="8">A</text></g>
  <g className="block-marker" transform="translate(118 272)"><circle r="23"/><text y="8">B</text></g>
  <g className="block-marker" transform="translate(570 245)"><circle r="23"/><text y="8">D</text></g>
  <g className="block-marker" transform="translate(548 382)"><circle r="23"/><text y="8">E</text></g>
  <g className="block-marker small" transform="translate(1065 478)"><circle r="21"/><text y="7">J</text></g>
  <g className="block-marker small" transform="translate(1172 528)"><circle r="21"/><text y="7">K</text></g>
  <g className="north" transform="translate(1330 72)"><path d="M0 34L14 0L27 34L14 27Z"/><text x="14" y="53">N</text></g>
 </g>;
}
