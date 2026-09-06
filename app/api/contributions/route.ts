export async function GET(request:Request){
 const user=new URL(request.url).searchParams.get('user')||'';
 if(!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(user))return Response.json({error:'GitHubユーザー名を確認してください。'},{status:400});
 try{const y=new Date().getUTCFullYear();const r=await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(user)}?y=${y}&y=${y-1}`,{signal:AbortSignal.timeout(20000)});
 if(!r.ok)return Response.json({error:r.status===404?'ユーザーが見つかりません。':'取得できませんでした。少し待って再試行してください。'},{status:502});
 const d=await r.json() as {contributions?:{date:string;count:number}[]};
 if(!Array.isArray(d.contributions)||!d.contributions.length||d.contributions.some(v=>!/^\d{4}-\d{2}-\d{2}$/.test(v.date)||!Number.isInteger(v.count)||v.count<0))throw Error('invalid');
 return Response.json({contributions:d.contributions.sort((a,b)=>a.date.localeCompare(b.date))},{headers:{'Cache-Control':'private, max-age=300'}});
 }catch{return Response.json({error:'取得に失敗しました。もう一度お試しください。'},{status:502})}
}
