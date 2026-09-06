export type Day={date:string;count:number};
export function dayKey(d:Date){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
export function shiftDay(key:string,n:number){const d=new Date(key+'T12:00:00');d.setDate(d.getDate()+n);return dayKey(d)}
export function calendar(days:Day[],end:string,n:number){const map=new Map(days.map(d=>[d.date,d.count]));return Array.from({length:n},(_,i)=>{const date=shiftDay(end,i-n+1);return {date,count:map.get(date)||0}})}
export function streak(days:Day[],today:string){const map=new Map(days.map(d=>[d.date,d.count]));let date=(map.get(today)||0)>0?today:shiftDay(today,-1),count=0;while((map.get(date)||0)>0){count++;date=shiftDay(date,-1)}return count}
export function dailyTier(count:number){return count>=50?'LEGEND':count>=20?'ON FIRE':count>=10?'GREAT':count>=1?'STARTED':'READY'}
