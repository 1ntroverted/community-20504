import {useEffect,useState} from 'react';
import {userApi,setToken} from '../api/api';
export default function UserPage({user,onLogin,onRefresh,onLogout}){
 const [mode,setMode]=useState('login');const [form,setForm]=useState({name:'',email:'',password:'',phone:''});
 useEffect(()=>{if(user)setForm({name:user.name,email:user.email,phone:user.phone||'',password:''})},[user]);
 const change=e=>setForm({...form,[e.target.name]:e.target.value});
 const submit=async e=>{e.preventDefault();try{
 if(user){await userApi.update(form);await onRefresh();alert('프로필 수정 완료');setForm(f=>({...f,password:''}));}
 else if(mode==='register'){await userApi.register(form);alert('회원가입 성공! 로그인해 주세요.');setMode('login');setForm(f=>({...f,password:''}));}
 else {const data=await userApi.login(form);setToken(data.token);onLogin(data.user);}
 }catch(err){alert(err.message)}};
 const remove=async()=>{if(!window.confirm('정말 탈퇴하시겠습니까? 작성한 게시글도 삭제됩니다.'))return;try{await userApi.remove();onLogout();alert('탈퇴 완료');}catch(err){alert(err.message)}};
 return <div className="page"><h2>{user?'마이페이지':mode==='login'?'로그인':'회원가입'}</h2>
 {!user&&<div><button type="button" onClick={()=>setMode('login')}>로그인</button> <button type="button" onClick={()=>setMode('register')}>회원가입</button></div>}
 <form className="form" onSubmit={submit}>
 {(user||mode==='register')&&<input name="name" placeholder="이름" value={form.name} onChange={change} required/>}
 <input name="email" type="email" placeholder="이메일" value={form.email} onChange={change} required/>
 {(user||mode==='register')&&<input name="phone" placeholder="전화번호 (선택)" value={form.phone} onChange={change}/>}
 <input name="password" type="password" placeholder={user?'새 비밀번호 (변경하지 않으려면 비워두기)':'비밀번호 (6자 이상)'} value={form.password} onChange={change} required={!user} minLength={user?undefined:6}/>
 <button type="submit">{user?'프로필 수정':mode==='login'?'로그인':'회원가입'}</button></form>
 {user&&<><p>회원번호: {user.id} / 가입 이메일: {user.email}</p><button className="delete" onClick={remove}>회원 탈퇴</button></>}
 </div>;
}
