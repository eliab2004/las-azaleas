export const financingPolicy={annualRate:.14,interestFromMonths:24,maxMonths:120,defaultDownPayment:3000,confirmed:true};
export const terms=[12,18,24,36,48,60,72,84,96,108,120];
export function paymentPlan(price:number,downPayment:number,months:number,confirmed=financingPolicy.confirmed){
 if(!Number.isFinite(price)||price<=0||!Number.isFinite(downPayment)||downPayment<0||downPayment>price)throw new Error('Revisa el precio y el enganche.');
 const cents=(n:number)=>Math.round((n+Number.EPSILON)*100)/100;
 if(months===0)return {price:cents(price),downPayment:cents(price),principal:0,months:0,annualRate:0,payment:0,lastPayment:0,totalInterest:0,total:cents(price),schedule:[]};
 if(!terms.includes(months))throw new Error('Selecciona un plazo de 12 a 120 meses.');
 if(!confirmed)throw new Error('Pendiente de confirmar el enganche y el método de interés.');
 if(downPayment<financingPolicy.defaultDownPayment)throw new Error('El enganche mínimo es Q3,000.');
 const principal=cents(price-downPayment);if(principal<=0)throw new Error('Selecciona contado si pagarás el precio completo.');
 const annualRate=months>=24?.14:0,rate=annualRate/12;
 const payment=cents(rate?principal*rate/(1-Math.pow(1+rate,-months)):principal/months);
 let balance=principal,totalInterest=0;const schedule=[];
 for(let month=1;month<=months;month++){const interest=cents(balance*rate),amount=month===months?cents(balance+interest):Math.min(payment,cents(balance+interest)),capital=cents(amount-interest);balance=cents(Math.max(0,balance-capital));totalInterest=cents(totalInterest+interest);schedule.push({month,payment:amount,interest,capital,balance});}
 return {price:cents(price),downPayment:cents(downPayment),principal,months,annualRate,payment,lastPayment:schedule.at(-1)!.payment,totalInterest,total:cents(price+totalInterest),schedule};
}
