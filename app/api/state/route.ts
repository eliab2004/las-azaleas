import {db,member,fail} from '../../../lib/server';

export async function GET(req:Request){try{
 const m=await member(req),seller=m.role==='vendedor'||m.role==='asesor';
 const branches=await db().prepare(seller?'SELECT * FROM branches WHERE id=?':'SELECT * FROM branches').bind(...(seller?[m.branch_id]:[])).all();
 const projects=await db().prepare(seller?'SELECT * FROM projects WHERE branch_id=?':'SELECT * FROM projects').bind(...(seller?[m.branch_id]:[])).all();
 const lots=await db().prepare(seller?'SELECT l.* FROM lots l JOIN projects p ON l.project_id=p.id WHERE p.branch_id=?':'SELECT * FROM lots').bind(...(seller?[m.branch_id]:[])).all();
 const clients=m.role==='secretaria'?(await db().prepare('SELECT r.*,l.code,p.name project FROM reservations r JOIN lots l ON l.id=r.lot_id JOIN projects p ON p.id=l.project_id ORDER BY r.created_at DESC').all()).results:[];
 const users=m.is_owner?(await db().prepare('SELECT email,name,role,branch_id,username,is_owner FROM members ORDER BY is_owner DESC,name').all()).results:[];
 const safeMember={email:m.email,name:m.name,role:m.role,branch_id:m.branch_id,username:m.username,is_owner:Boolean(m.is_owner)};
 return Response.json({member:safeMember,branches:branches.results,projects:projects.results,lots:lots.results,clients,users},{headers:{'Cache-Control':'no-store'}});
}catch(e){return fail(e)}}
