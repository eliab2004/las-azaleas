import {db,member,role,mutation,fail,txt} from '../../../lib/server';
import {azaleasLots,azaleasProjects} from '../../../lib/azaleas';
export async function POST(req:Request){try{mutation(req);const m=await member();const input:any=await req.json();role(m,'administrador');const branchId=txt(input.branchId);const b=await db().prepare('SELECT id FROM branches WHERE id=?').bind(branchId).first();if(!b)throw new Error('400|Selecciona una sucursal existente.');
const existing=await db().prepare("SELECT id,branch_id FROM projects WHERE id IN ('azaleas-i','azaleas-ii')").all<any>();if(existing.results.some(p=>p.branch_id!==branchId))throw new Error('409|Las Azaleas ya fue importada en otra sucursal.');
const statements=azaleasProjects.map(p=>db().prepare(`INSERT INTO projects(id,branch_id,name,location,map_asset,map_height) VALUES(?,?,?,?,?,?)
 ON CONFLICT(id) DO UPDATE SET name=excluded.name,location=excluded.location,map_asset=excluded.map_asset,map_height=excluded.map_height`).bind(p.id,branchId,p.name,p.location,p.map_asset,p.map_height));
for(const l of azaleasLots)statements.push(db().prepare(`INSERT INTO lots(id,project_id,code,area,price,points,status,block,source,review_reason) VALUES(?,?,?,?,?,?,?,?,?,?)
 ON CONFLICT(id) DO UPDATE SET project_id=excluded.project_id,code=excluded.code,area=excluded.area,price=excluded.price,points=excluded.points,block=excluded.block,source=excluded.source,review_reason=excluded.review_reason`).bind(l.id,l.project_id,l.code,l.area,l.price,l.points,l.status,l.block,l.source,l.review_reason));
// Repeating the import refreshes catalogue geometry and metadata without changing availability.
for(let i=0;i<statements.length;i+=50)await db().batch(statements.slice(i,i+50));
return Response.json({ok:true,count:azaleasLots.length});}catch(e){return fail(e)}}
