import {db,member,role,fail,mutation,txt} from '../../../lib/server';
export async function POST(req:Request){try{mutation(req);const m=await member(req);const b:any=await req.json();role(m,'secretaria');const r=await db().prepare("UPDATE lots SET status='vendido' WHERE id=? AND status='reservado'").bind(txt(b.lotId)).run();if(!r.meta.changes)throw new Error('409|Solo se pueden vender lotes reservados.');return Response.json({ok:true});}catch(e){return fail(e)}}


