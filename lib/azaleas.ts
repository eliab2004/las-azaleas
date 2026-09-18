import imported from './data/azaleas.json';
export const azaleasProjects=[
  {id:'azaleas-i',branch_id:'azaleas-monjas',name:'Las Azaleas · Fase I',location:'Monjas · Plano vectorial remasterizado',map_asset:null,map_height:380},
];
export const azaleasLots=imported.filter((l:any)=>l.project_id==='azaleas-i');
