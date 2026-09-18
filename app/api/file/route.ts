import {db,bucket,member,role,project,fail} from '../../../lib/server';
export async function GET(req:Request){try{
 const m=await member();const q=new URL(req.url).searchParams;let key:string|undefined;
 if(q.get('project')){const p:any=await project(m,q.get('project')!);key=p.map_key;}
 else{role(m,'secretaria');const r=await db().prepare('SELECT front,back,details FROM reservations WHERE id=?').bind(q.get('reservation')).first<any>();if(!r)throw new Error('404|Expediente no encontrado.');const side=q.get('side');if(side==='front'||side==='back')key=r[side];else if(side==='clientSignature'||side==='advisorSignature'){try{const d=JSON.parse(r.details||'{}');key=side==='clientSignature'?d.signatures?.client:d.signatures?.advisor}catch{key=undefined}}else throw new Error('400|Imagen no válida.');}
 if(!key)throw new Error('404|Imagen no encontrada.');const object=await bucket().get(key);if(!object)throw new Error('404|Imagen no encontrada.');return new Response(object.body,{headers:{'Content-Type':object.httpMetadata?.contentType||'image/jpeg','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
}catch(e){return fail(e)}}
