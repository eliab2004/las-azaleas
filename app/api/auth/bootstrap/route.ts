import {db,identity,fail,mutation,txt} from '../../../../lib/server';
import {passwordRecord,validPassword,validUsername,issueSession,setSessionCookie} from '../../../../lib/auth';

export async function POST(req:Request){try{
 mutation(req);const input:any=await req.json();if(!validUsername(input.username)||!validPassword(input.password))throw new Error('400|Usa un usuario de 2 a 80 caracteres y una contraseña de al menos 10 caracteres.');
 const exists=await db().prepare("SELECT 1 ready FROM members WHERE is_owner=1 AND password_hash IS NOT NULL LIMIT 1").first();if(exists)throw new Error('409|La cuenta propietaria ya fue configurada.');
 const user=await identity(),username=txt(input.username,80).toLowerCase(),record=await passwordRecord(input.password);const taken=await db().prepare('SELECT email FROM members WHERE username=?').bind(username).first();if(taken)throw new Error('409|Ese usuario ya está en uso.');
 await db().batch([
  db().prepare('UPDATE members SET is_owner=0'),
  db().prepare(`INSERT INTO members(email,name,role,branch_id,username,password_hash,password_salt,is_owner) VALUES(?,?,?,NULL,?,?,?,1)
   ON CONFLICT(email) DO UPDATE SET name=excluded.name,role='administrador',branch_id=NULL,username=excluded.username,password_hash=excluded.password_hash,password_salt=excluded.password_salt,is_owner=1`).bind(user.email.toLowerCase(),user.displayName,'administrador',username,record.hash,record.salt)
 ]);
 const token=await issueSession(user.email.toLowerCase());return Response.json({ok:true},{headers:{'Set-Cookie':setSessionCookie(token,req),'Cache-Control':'no-store'}});
}catch(e){return fail(e)}}
