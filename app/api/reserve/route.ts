import {db,bucket,member,role,project,fail,mutation,txt} from '../../../lib/server';
import {validateCustomer} from '../../../lib/customer-form';
import {paymentPlan} from '../../../lib/finance';

function pngData(value:FormDataEntryValue|null){
 const raw=txt(value,1_500_000),match=/^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(raw);
 if(!match)throw new Error('400|Completa ambas firmas.');
 const decoded=atob(match[1]);
 if(decoded.length<100||decoded.length>1024*1024)throw new Error('400|Revisa ambas firmas.');
 return Uint8Array.from(decoded,c=>c.charCodeAt(0));
}

export async function POST(req:Request){try{
 mutation(req);const m=await member(req);role(m,'vendedor','asesor','secretaria','administrador');const f=await req.formData();
 const lotId=txt(f.get('lotId'));const l=await db().prepare('SELECT l.*,p.name project_name FROM lots l JOIN projects p ON p.id=l.project_id WHERE l.id=?').bind(lotId).first<any>();
 if(!l)throw new Error('404|Lote no encontrado.');await project(m,l.project_id);if(l.status!=='libre')throw new Error('409|Este lote ya no está disponible.');
 const input=Object.fromEntries([...f.entries()].filter(([,v])=>typeof v==='string')) as Record<string,string>;
 const customer=validateCustomer(input);const months=Number(f.get('months'));const downPayment=months===0?l.price:Number(f.get('downPayment'));const plan=paymentPlan(Number(l.price),downPayment,months);
 const front=f.get('front'),back=f.get('back');for(const file of [front,back])if(!(file instanceof File)||file.type!=='image/jpeg'||file.size<100||file.size>5*1024*1024)throw new Error('400|Captura ambos lados del documento (máximo 5 MB por foto).');
 const clientSignature=pngData(f.get('clientSignature')),advisorSignature=pngData(f.get('advisorSignature'));
 const id=crypto.randomUUID(),keys=[`dpi/${id}/front.jpg`,`dpi/${id}/back.jpg`,`signatures/${id}/client.png`,`signatures/${id}/advisor.png`];
 const details=JSON.stringify({formVersion:'Las Azaleas V.2025',customer,plan,lot:{code:l.code,block:l.block,area:l.area,price:l.price,project:l.project_name},signatures:{client:keys[2],advisor:keys[3]}});
 try{
  await bucket().put(keys[0],await (front as File).arrayBuffer(),{httpMetadata:{contentType:'image/jpeg'}});await bucket().put(keys[1],await (back as File).arrayBuffer(),{httpMetadata:{contentType:'image/jpeg'}});await bucket().put(keys[2],clientSignature,{httpMetadata:{contentType:'image/png'}});await bucket().put(keys[3],advisorSignature,{httpMetadata:{contentType:'image/png'}});
  const results=await db().batch([db().prepare("INSERT INTO reservations(id,lot_id,name,dpi,phone,address,front,back,created_by,created_at,details) SELECT ?,?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM lots WHERE id=? AND status='libre')").bind(id,lotId,customer.name,customer.dpi,customer.phone,customer.address,keys[0],keys[1],m.email,new Date().toISOString(),details,lotId),db().prepare("UPDATE lots SET status='reservado' WHERE id=? AND EXISTS(SELECT 1 FROM reservations WHERE id=?)").bind(lotId,id)]);
  if(!results[0].meta.changes)throw new Error('409|Otro usuario reservó este lote. Actualiza la disponibilidad.');
 }catch(e){await bucket().delete(keys);throw e;}
 return Response.json({ok:true,id});
}catch(e){return fail(e)}}
