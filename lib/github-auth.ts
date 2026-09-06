export type ContributionDay = {date:string;count:number;level:number};
const levels = ['NONE','FIRST_QUARTILE','SECOND_QUARTILE','THIRD_QUARTILE','FOURTH_QUARTILE'];
export async function fetchAuthenticatedCalendar(token:string) {
 const response = await fetch('https://api.github.com/graphql', {
  method:'POST', credentials:'omit', cache:'no-store', redirect:'error',
  headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},
  body:JSON.stringify({query:'query { viewer { login contributionsCollection { contributionCalendar { weeks { contributionDays { date contributionCount contributionLevel } } } } } }'}),
  signal:AbortSignal.timeout(25000),
 });
 if(response.status===401)throw Error('トークンが無効か期限切れです。作り直して接続してください。');
 if(response.status===403||response.status===429)throw Error('GitHubがアクセスを制限しています。権限を確認するか、時間をおいて再接続してください。');
 if(!response.ok)throw Error('GitHubに接続できませんでした。もう一度お試しください。');
 const scopes=response.headers.get('x-oauth-scopes');
 if(scopes!==null&&!scopes.split(',').some(s=>['read:user','user'].includes(s.trim())))throw Error('read:user 権限のあるトークン（classic）を使ってください。');
 const payload=await response.json();
 if(payload.errors?.length)throw Error('GitHubから記録を取得できませんでした。トークンの read:user 権限を確認してください。');
 const viewer=payload.data?.viewer;
 const weeks=viewer?.contributionsCollection?.contributionCalendar?.weeks;
 if(typeof viewer?.login!=='string'||!Array.isArray(weeks))throw Error('GitHubの応答を確認できませんでした。');
 const contributions:ContributionDay[]=weeks.flatMap((w:{contributionDays:Record<string,unknown>[]})=>{
  if(!Array.isArray(w.contributionDays))throw Error('日別の記録を確認できませんでした。');
  return w.contributionDays.map(d=>{
   const level=levels.indexOf(d.contributionLevel as string);
   if(typeof d.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d.date)||!Number.isInteger(d.contributionCount)||(d.contributionCount as number)<0||level<0)throw Error('日別の記録を確認できませんでした。');
   return {date:d.date,count:d.contributionCount as number,level};
  });
 });
 if(!contributions.length)throw Error('表示できる記録がありません。');
 return {login:viewer.login as string,contributions};
}
