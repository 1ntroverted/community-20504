import {useEffect,useState} from 'react';
import {userApi,getToken,setToken} from './api/api';
import UserPage from './components/UserPage';
import BoardPage from './components/BoardPage';
import JoinPage from './components/JoinPage';
import './App.css';
export default function App(){
 const [menu,setMenu]=useState('board');const [user,setUser]=useState(null);
 const refresh=()=>userApi.me().then(setUser).catch(()=>{setToken(null);setUser(null)});
 useEffect(()=>{if(getToken())refresh()},[]);
 const logout=()=>{setToken(null);setUser(null);setMenu('board')};
 return <div className="app"><header className="header"><h1>COMMUNITY 20504</h1><p>React + Express + MySQL CRUD</p><p>{user?`${user.name}님 로그인 중`:'로그인하지 않았습니다.'}</p></header>
 <nav className="nav"><button className={menu==='board'?'active':''} onClick={()=>setMenu('board')}>게시글 관리</button><button className={menu==='user'?'active':''} onClick={()=>setMenu('user')}>{user?'마이페이지':'회원가입 / 로그인'}</button><button className={menu==='join'?'active':''} onClick={()=>setMenu('join')}>JOIN 조회</button>{user&&<button onClick={logout}>로그아웃</button>}</nav>
 <main className="main">{menu==='user'?<UserPage user={user} onLogin={u=>{setUser(u);setMenu('board')}} onRefresh={refresh} onLogout={logout}/>:menu==='board'?<BoardPage user={user} onLogin={()=>setMenu('user')}/>:<JoinPage/>}</main><footer className="footer">Community CRUD Project - 20504</footer></div>;
}
