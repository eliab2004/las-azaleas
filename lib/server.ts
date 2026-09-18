import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../app/chatgpt-auth';
import {sessionMember} from './auth';
export const db=()=> (env as unknown as {DB:D1Database}).DB;
export const bucket=()=> (env as unknown as {BUCKET:R2Bucket}).BUCKET;
export async function identity(){const u=await getChatGPTUser();if(!u)throw new Error('401|Inicia sesión para continuar.');return u;}
export async function member(req:Request){return sessionMember(req);}
export function role(m:any,...roles:string[]){if(!roles.includes(m.role))throw new Error('403|No tienes permiso para esta acción.');}
export async function project(m:any,id:string){const p=await db().prepare('SELECT * FROM projects WHERE id=?').bind(id).first<any>();if(!p)throw new Error('404|Lotificación no encontrada.');if((m.role==='vendedor'||m.role==='asesor')&&m.branch_id!==p.branch_id)throw new Error('403|Esta lotificación pertenece a otra sucursal.');return p;}
export function fail(e:unknown){const msg=e instanceof Error?e.message:'';const [code,detail]=msg.split('|');if(['400','401','403','404','409','429'].includes(code))return Response.json({error:detail},{status:Number(code),headers:{'Cache-Control':'no-store'}});console.error('Request failed',e instanceof Error?e.name:'unknown');return Response.json({error:'No pudimos completar la operación. Intenta nuevamente.'},{status:500});}
export function mutation(req:Request){if(req.headers.get('origin')!==new URL(req.url).origin)throw new Error('403|Origen no permitido.');}
export function txt(v:unknown,max=160){if(typeof v!=='string'||!v.trim()||v.length>max)throw new Error('400|Revisa los campos obligatorios.');return v.trim();}
