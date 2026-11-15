const API=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
export const getToken=()=>localStorage.getItem('community_token');
export const setToken=t=>t?localStorage.setItem('community_token',t):localStorage.removeItem('community_token');
async function request(path,method='GET',body){
 const r=await fetch(API+path,{method,headers:{'Content-Type':'application/json',...(getToken()?{Authorization:'Bearer '+getToken()}:{})},...(body?{body:JSON.stringify(body)}:{})});
 const data=await r.json();if(!r.ok)throw Error(data.message||'요청 실패');return data;
}
export const userApi={register:d=>request('/users/register','POST',d),login:d=>request('/users/login','POST',d),me:()=>request('/users/me'),update:d=>request('/users/me','PUT',d),remove:()=>request('/users/me','DELETE')};
export const boardApi={list:()=>request('/boards'),create:d=>request('/boards','POST',d),update:(id,d)=>request('/boards/'+id,'PUT',d),remove:id=>request('/boards/'+id,'DELETE')};
export const joinApi={userPosts:()=>request('/join/user-posts'),postComments:()=>request('/join/post-comments')};
