import {env} from 'cloudflare:workers';
import {sessionMember} from './auth';
export const db=()=> (env as unknown as {DB:D1Database}).DB;
export const bucket=()=>{
 const e=env as any;if(e.BUCKET)return e.BUCKET as R2Bucket;
 if(e.FILES){const kv=e.FILES as KVNamespace;return {
  async get(key:string){const val=await kv.get(key,{type:'arrayBuffer'});if(!val)return null;const meta=(await kv.getWithMetadata<{contentType?:string}>(key)).metadata;return {body:val,httpMetadata:{contentType:meta?.contentType||'image/jpeg'}} as any;},
  async put(key:string,value:ArrayBuffer|Uint8Array,options?:{httpMetadata?:{contentType?:string}}){await kv.put(key,value,{metadata:{contentType:options?.httpMetadata?.contentType||'image/jpeg'}});},
  async delete(keys:string|string[]){const list=Array.isArray(keys)?keys:[keys];for(const k of list)await kv.delete(k);}
 };}
 throw new Error('No storage configured');
};
export async function identity(req:Request){
 const userId=req.headers.get('oai-authenticated-user-id'),email=req.headers.get('oai-authenticated-user-email');if(!userId||!email)throw new Error('401|Inicia sesión para continuar.');
 const encodedName=req.headers.get('oai-authenticated-user-full-name'),encoded=req.headers.get('oai-authenticated-user-full-name-encoding')==='percent-encoded-utf-8';let fullName:string|null=null;
 if(encodedName)try{fullName=encoded?decodeURIComponent(encodedName):encodedName}catch{}
 return {userId,email,displayName:fullName||email,fullName};
}
export async function member(req:Request){return sessionMember(req);}
export function role(m:any,...roles:string[]){if(!roles.includes(m.role))throw new Error('403|No tienes permiso para esta acción.');}
export async function project(m:any,id:string){const p=await db().prepare('SELECT * FROM projects WHERE id=?').bind(id).first<any>();if(!p)throw new Error('404|Lotificación no encontrada.');if((m.role==='vendedor'||m.role==='asesor')&&m.branch_id!==p.branch_id)throw new Error('403|Esta lotificación pertenece a otra sucursal.');return p;}
export function fail(e:unknown){const msg=e instanceof Error?e.message:'';const [code,detail]=msg.split('|');if(['400','401','403','404','409','429'].includes(code))return Response.json({error:detail},{status:Number(code),headers:{'Cache-Control':'no-store'}});console.error('Request failed:',e);return Response.json({error:'No pudimos completar la operación. Intenta nuevamente.'},{status:500});}
export function mutation(req:Request){const origin=req.headers.get('origin');if(!origin)return;const reqOrigin=new URL(req.url).origin;if(origin===reqOrigin)return;try{const o=new URL(origin);if(o.hostname.endsWith('.trycloudflare.com')||o.hostname.endsWith('.loca.lt')||o.hostname==='localhost'||o.hostname==='127.0.0.1'||o.host==='localhost:5173')return;}catch{}throw new Error('403|Origen no permitido.');}
export function txt(v:unknown,max=160){if(typeof v!=='string'||!v.trim()||v.length>max)throw new Error('400|Revisa los campos obligatorios.');return v.trim();}
