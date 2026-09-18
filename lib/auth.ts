import {env} from 'cloudflare:workers';

const COOKIE='terralote_session',SESSION_SECONDS=60*60*12,encoder=new TextEncoder();
const db=()=> (env as unknown as {DB:D1Database}).DB;

function bytesToBase64(bytes:Uint8Array){let raw='';for(const b of bytes)raw+=String.fromCharCode(b);return btoa(raw).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'')}
function base64ToBytes(value:string){const normalized=value.replaceAll('-','+').replaceAll('_','/');const raw=atob(normalized+'='.repeat((4-normalized.length%4)%4));return Uint8Array.from(raw,c=>c.charCodeAt(0))}
async function digest(value:string){return bytesToBase64(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value))))}

export function validUsername(value:unknown){return typeof value==='string'&&/^[a-zA-Z0-9._-]{3,40}$/.test(value.trim())}
export function validPassword(value:unknown){return typeof value==='string'&&value.length>=10&&value.length<=128}

export async function passwordRecord(password:string,saltValue?:string){
 const salt=saltValue?base64ToBytes(saltValue):crypto.getRandomValues(new Uint8Array(16));
 const material=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);
 const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:210_000},material,256);
 return {salt:bytesToBase64(salt),hash:bytesToBase64(new Uint8Array(bits))};
}

export async function verifyPassword(password:string,salt:string,expected:string){
 const actual=(await passwordRecord(password,salt)).hash;if(actual.length!==expected.length)return false;
 let difference=0;for(let i=0;i<actual.length;i++)difference|=actual.charCodeAt(i)^expected.charCodeAt(i);return difference===0;
}

function cookieValue(req:Request,name:string){for(const part of (req.headers.get('cookie')||'').split(';')){const [key,...rest]=part.trim().split('=');if(key===name)return decodeURIComponent(rest.join('='))}return ''}

export async function sessionMember(req:Request){
 const token=cookieValue(req,COOKIE);if(!token)throw new Error('401|Inicia sesión para continuar.');
 const id=await digest(token),now=new Date().toISOString();
 const member=await db().prepare('SELECT m.* FROM sessions s JOIN members m ON m.email=s.member_email WHERE s.id=? AND s.expires_at>?').bind(id,now).first<any>();
 if(!member)throw new Error('401|Tu sesión terminó. Inicia sesión nuevamente.');return member;
}

export async function issueSession(email:string){
 const token=bytesToBase64(crypto.getRandomValues(new Uint8Array(32))),id=await digest(token),expires=new Date(Date.now()+SESSION_SECONDS*1000).toISOString();
 await db().prepare('INSERT INTO sessions(id,member_email,expires_at,created_at) VALUES(?,?,?,?)').bind(id,email,expires,new Date().toISOString()).run();
 return token;
}

export async function revokeSession(req:Request){const token=cookieValue(req,COOKIE);if(token)await db().prepare('DELETE FROM sessions WHERE id=?').bind(await digest(token)).run()}
export function setSessionCookie(token:string,req:Request){return `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${new URL(req.url).protocol==='https:'?'; Secure':''}`}
export function clearSessionCookie(req:Request){return `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${new URL(req.url).protocol==='https:'?'; Secure':''}`}
export async function attemptKey(req:Request,username:string){const ip=req.headers.get('cf-connecting-ip')||req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';return digest(ip+'|'+username.toLowerCase())}
