import {fail,mutation} from '../../../../lib/server';
import {clearSessionCookie,revokeSession} from '../../../../lib/auth';

export async function POST(req:Request){try{mutation(req);await revokeSession(req);return Response.json({ok:true},{headers:{'Set-Cookie':clearSessionCookie(req),'Cache-Control':'no-store'}})}catch(e){return fail(e)}}
