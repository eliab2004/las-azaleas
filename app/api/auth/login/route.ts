import {db,fail,mutation,txt} from '../../../../lib/server';
import {attemptKey,issueSession,setSessionCookie,validPassword,validUsername,verifyPassword} from '../../../../lib/auth';

export async function POST(req:Request){try{
 mutation(req);const input:any=await req.json();if(!validUsername(input.username)||!validPassword(input.password))throw new Error('401|Usuario o contraseña incorrectos.');
 const username=txt(input.username,80).toLowerCase(),key=await attemptKey(req,username),now=Date.now(),attempt=await db().prepare('SELECT * FROM login_attempts WHERE id=?').bind(key).first<any>();
 if(attempt?.blocked_until&&Date.parse(attempt.blocked_until)>now)throw new Error('429|Demasiados intentos. Espera 15 minutos e inténtalo nuevamente.');
 const user=await db().prepare('SELECT * FROM members WHERE LOWER(username)=? OR LOWER(email)=?').bind(username,username).first<any>();const valid=Boolean(user?.password_hash&&user?.password_salt&&await verifyPassword(input.password,user.password_salt,user.password_hash));
 if(!valid){const recent=attempt&&now-Date.parse(attempt.updated_at)<15*60*1000?Number(attempt.attempts):0,count=recent+1,blocked=count>=5?new Date(now+15*60*1000).toISOString():null;await db().prepare('INSERT INTO login_attempts(id,attempts,blocked_until,updated_at) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET attempts=excluded.attempts,blocked_until=excluded.blocked_until,updated_at=excluded.updated_at').bind(key,count,blocked,new Date(now).toISOString()).run();throw new Error('401|Usuario o contraseña incorrectos.');}
 await db().prepare('DELETE FROM login_attempts WHERE id=?').bind(key).run();const token=await issueSession(user.email);return Response.json({ok:true},{headers:{'Set-Cookie':setSessionCookie(token,req),'Cache-Control':'no-store'}});
}catch(e){return fail(e)}}
