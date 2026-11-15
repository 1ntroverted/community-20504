import {useEffect,useState} from 'react';
import {boardApi} from '../api/api';
export default function BoardPage({user,onLogin}){
 const [boards,setBoards]=useState([]);const [form,setForm]=useState({title:'',content:''});const [editId,setEditId]=useState(null);
 const load=()=>boardApi.list().then(setBoards).catch(e=>alert(e.message));
 useEffect(()=>{load()},[]);
 const reset=()=>{setForm({title:'',content:''});setEditId(null)};
 const submit=async e=>{e.preventDefault();try{if(editId)await boardApi.update(editId,form);else await boardApi.create(form);reset();await load();alert('저장 완료');}catch(e){alert(e.message)}};
 const edit=b=>{setEditId(b.id);setForm({title:b.title,content:b.content});window.scrollTo(0,0)};
 const remove=async id=>{if(!window.confirm('삭제하시겠습니까?'))return;try{await boardApi.remove(id);await load();}catch(e){alert(e.message)}};
 return <div className="page"><h2>게시글 관리</h2>{user?<form className="form" onSubmit={submit}><p>작성자: {user.name}</p><input placeholder="제목" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/><textarea placeholder="내용" value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required/><button type="submit">{editId?'게시글 수정':'게시글 등록'}</button><button type="button" onClick={reset}>초기화</button></form>:<p>글을 작성하려면 <button onClick={onLogin}>로그인 / 회원가입</button> 해주세요. 목록은 누구나 볼 수 있습니다.</p>}
 <h3>전체 게시글 목록</h3><table><thead><tr><th>번호</th><th>작성자</th><th>제목</th><th>내용</th><th>관리</th></tr></thead><tbody>{boards.map(b=><tr key={b.id}><td>{b.id}</td><td>{b.writer}</td><td>{b.title}</td><td>{b.content}</td><td>{user?.id===b.user_id?<><button onClick={()=>edit(b)}>수정</button> <button className="delete" onClick={()=>remove(b.id)}>삭제</button></>:'본인 글만 가능'}</td></tr>)}{boards.length===0&&<tr><td colSpan="5">게시글이 없습니다.</td></tr>}</tbody></table></div>;
}
