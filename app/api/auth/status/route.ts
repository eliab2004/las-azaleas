import {db,fail} from '../../../../lib/server';
import {sessionMember} from '../../../../lib/auth';

export async function GET(req:Request){try{
 const configured=Boolean((await db().prepare("SELECT 1 ready FROM members WHERE is_owner=1 AND password_hash IS NOT NULL LIMIT 1").first<any>())?.ready);
 let authenticated=false;try{await sessionMember(req);authenticated=true}catch{}
 return Response.json({configured,authenticated},{headers:{'Cache-Control':'no-store'}});
}catch(e){return fail(e)}}
