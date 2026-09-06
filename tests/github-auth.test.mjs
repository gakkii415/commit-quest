import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fetchAuthenticatedCalendar} from '../lib/github-auth.ts';
test('official dates, counts and levels stay intact; credential goes only to GitHub',async()=>{
 const names=['NONE','FIRST_QUARTILE','SECOND_QUARTILE','THIRD_QUARTILE','FOURTH_QUARTILE'];
 globalThis.fetch=async(url,options)=>{
  assert.equal(url,'https://api.github.com/graphql');
  assert.equal(options.headers.Authorization,'Bearer example-test-token');
  assert.equal(options.cache,'no-store');
  assert.equal(options.redirect,'error');
  assert.ok(!options.body.includes('example-test-token'));
  return new Response(JSON.stringify({data:{viewer:{login:'test-user',contributionsCollection:{contributionCalendar:{weeks:[{contributionDays:names.map((level,i)=>({date:'2026-09-0'+(i+1),contributionCount:i,contributionLevel:level}))}]}}}}}),{headers:{'x-oauth-scopes':'read:user'}});
 };
 const result=await fetchAuthenticatedCalendar('example-test-token');
 assert.equal(result.login,'test-user');
 assert.deepEqual(result.contributions.map(d=>d.level),[0,1,2,3,4]);
 assert.equal(result.contributions[4].date,'2026-09-05');
 assert.equal(result.contributions[4].count,4);
});
test('reject invalid auth, missing scope, partial GraphQL errors and malformed days',async()=>{
 for(const response of [
  new Response('{}',{status:401}),
  new Response('{}',{headers:{'x-oauth-scopes':'repo'}}),
  new Response(JSON.stringify({errors:[{message:'denied'}]})),
  new Response(JSON.stringify({data:{viewer:{login:'x',contributionsCollection:{contributionCalendar:{weeks:[{contributionDays:[{date:'2026-01-01',contributionCount:1,contributionLevel:'INVALID'}]}]}}}}})),
 ]){
  globalThis.fetch=async()=>response;
  await assert.rejects(fetchAuthenticatedCalendar('example-test-token'));
 }
});
