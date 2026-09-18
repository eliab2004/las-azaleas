import {db,member,role,project,fail,mutation,txt} from '../../../lib/server';
import {passwordRecord,validPassword,validUsername} from '../../../lib/auth';

export async function POST(req:Request){try{
 mutation(req);const b:any=await req.json(),m=await member(req);role(m,'administrador');const id=crypto.randomUUID();
 if(b.action==='branch')await db().prepare('INSERT INTO branches(id,name) VALUES(?,?)').bind(id,txt(b.name)).run();
 else if(b.action==='project')await db().prepare('INSERT INTO projects(id,branch_id,name,location) VALUES(?,?,?,?)').bind(id,txt(b.branchId),txt(b.name),txt(b.location)).run();
 else if(b.action==='member'){
  if(!m.is_owner)throw new Error('403|Solo la cuenta propietaria puede crear o editar usuarios.');
  const email=txt(b.email).toLowerCase(),username=txt(b.username,80).toLowerCase(),name=txt(b.name),newPassword=typeof b.password==='string'?b.password:'';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!validUsername(username)||!['secretaria','vendedor'].includes(b.role))throw new Error('400|Revisa el correo, el usuario y el rol.');
  const existing=await db().prepare('SELECT email,is_owner FROM members WHERE email=?').bind(email).first<any>();
  if(existing?.is_owner)throw new Error('403|La cuenta propietaria no se modifica desde este formulario.');
  const taken=await db().prepare('SELECT email FROM members WHERE username=? AND email<>?').bind(username,email).first();
  if(taken)throw new Error('409|Ese nombre de usuario ya está en uso.');
  if(!existing&&!validPassword(newPassword))throw new Error('400|La contraseña debe tener entre 10 y 128 caracteres.');
  if(newPassword&&!validPassword(newPassword))throw new Error('400|La contraseña debe tener entre 10 y 128 caracteres.');
  const branchId=b.role==='vendedor'?txt(b.branchId):null;
  if(existing){
   if(newPassword){const credentials=await passwordRecord(newPassword);await db().batch([db().prepare('UPDATE members SET name=?,role=?,branch_id=?,username=?,password_hash=?,password_salt=? WHERE email=?').bind(name,b.role,branchId,username,credentials.hash,credentials.salt,email),db().prepare('DELETE FROM sessions WHERE member_email=?').bind(email)]);}
   else await db().prepare('UPDATE members SET name=?,role=?,branch_id=?,username=? WHERE email=?').bind(name,b.role,branchId,username,email).run();
  }else{
   const credentials=await passwordRecord(newPassword);await db().prepare('INSERT INTO members(email,name,role,branch_id,username,password_hash,password_salt,is_owner) VALUES(?,?,?,?,?,?,?,0)').bind(email,name,b.role,branchId,username,credentials.hash,credentials.salt).run();
  }
 }else if(b.action==='lot'){
  await project(m,txt(b.projectId));if(!Array.isArray(b.points)||b.points.length<3||b.points.length>50||b.points.some((p:any)=>!Array.isArray(p)||p.length!==2||p.some((n:any)=>typeof n!=='number'||!Number.isFinite(n)||n<0||n>1000)))throw new Error('400|Traza al menos tres puntos dentro del mapa.');
  if(!(Number(b.area)>0)||!Number.isFinite(Number(b.area))||!(Number(b.price)>=0)||!Number.isFinite(Number(b.price)))throw new Error('400|Revisa el área y el precio.');
  const exists=await db().prepare('SELECT id FROM lots WHERE project_id=? AND code=?').bind(b.projectId,txt(b.code,30)).first();if(exists)throw new Error('409|Ya existe un lote con ese código.');
  await db().prepare('INSERT INTO lots(id,project_id,code,area,price,points,status) VALUES(?,?,?,?,?,?,?)').bind(id,b.projectId,b.code,Number(b.area),Number(b.price),JSON.stringify(b.points),'libre').run();
 }else throw new Error('400|Acción no válida.');
 return Response.json({ok:true,id});
}catch(e){return fail(e)}}
