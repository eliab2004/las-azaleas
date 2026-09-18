import {db,member,fail} from '../../../lib/server';

export async function GET(){try{
 const m=await member();
 const seller=m.role==='vendedor'||m.role==='asesor';
 const lots=await db().prepare(seller?'SELECT l.id,l.status FROM lots l JOIN projects p ON l.project_id=p.id WHERE p.branch_id=?':'SELECT id,status FROM lots').bind(...(seller?[m.branch_id]:[])).all();
 return Response.json({lots:lots.results},{headers:{'Cache-Control':'no-store'}});
}catch(e){return fail(e)}}
