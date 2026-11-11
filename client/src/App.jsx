import { useState } from 'react';

import UserPage from './components/UserPage';
import BoardPage from './components/BoardPage';
import JoinPage from './components/JoinPage';

import './App.css';

function App() {
    const [menu, setMenu] = useState('user');

    return (
        <div className="app">

            <header className="header">
                <h1>COMMUNITY 20504</h1>
                <p>React + Express + MySQL CRUD</p>
            </header>

            <nav className="nav">
                <button
                    className={menu === 'user' ? 'active' : ''}
                    onClick={() => setMenu('user')}
                >
                    회원 관리
                </button>

                <button
                    className={menu === 'board' ? 'active' : ''}
                    onClick={() => setMenu('board')}
                >
                    게시글 관리
                </button>

                <button
                    className={menu === 'join' ? 'active' : ''}
                    onClick={() => setMenu('join')}
                >
                    JOIN 조회
                </button>
            </nav>

            <main className="main">
                {menu === 'user' && <UserPage />}
                {menu === 'board' && <BoardPage />}
                {menu === 'join' && <JoinPage />}
            </main>

            <footer className="footer">
                Community CRUD Project - 20504
            </footer>

        </div>
    );
}

export default App;