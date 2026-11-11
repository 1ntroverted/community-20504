import { useEffect, useState } from 'react';
import { boardApi, userApi } from '../api/api';

function BoardPage() {
    const [boards, setBoards] = useState([]);
    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({
        user_id: '',
        title: '',
        content: ''
    });

    const [editId, setEditId] = useState(null);

    const loadData = async () => {
        try {
            const [boardData, userData] = await Promise.all([
                boardApi.list(),
                userApi.list()
            ]);

            setBoards(boardData);
            setUsers(userData);

            // 등록할 때 사용할 기본 작성자
            setForm(prev => ({
                ...prev,
                user_id: prev.user_id || (
                    userData.length ? String(userData[0].id) : ''
                )
            }));
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // 등록 및 수정
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {
                ...form,
                user_id: Number(form.user_id)
            };

            if (editId) {
                await boardApi.update(editId, data);
                alert('게시글 수정 완료');
            } else {
                await boardApi.create(data);
                alert('게시글 등록 완료');
            }

            resetForm();
            await loadData();
        } catch (error) {
            alert(error.message);
        }
    };

    // 수정
    const handleEdit = (board) => {
        setEditId(board.id);

        setForm({
            user_id: String(board.user_id),
            title: board.title,
            content: board.content
        });
    };

    // 삭제
    const handleDelete = async (id) => {
        if (!window.confirm('게시글을 삭제하시겠습니까?')) return;

        try {
            await boardApi.remove(id);
            alert('게시글 삭제 완료');
            await loadData();
        } catch (error) {
            alert(error.message);
        }
    };

    const resetForm = () => {
        setEditId(null);

        setForm({
            user_id: users.length ? String(users[0].id) : '',
            title: '',
            content: ''
        });
    };

    return (
        <div className="page">

            <h2>게시글 관리</h2>

            <form onSubmit={handleSubmit} className="form">

                <select
                    name="user_id"
                    value={form.user_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">작성자 선택</option>

                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>

                <input
                    name="title"
                    placeholder="게시글 제목"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="content"
                    placeholder="게시글 내용"
                    value={form.content}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={!users.length}>
                    {editId ? '수정하기' : '게시글 등록'}
                </button>

                <button type="button" onClick={resetForm}>
                    초기화
                </button>

            </form>

            <h3>게시글 목록</h3>

            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>작성자</th>
                        <th>제목</th>
                        <th>내용</th>
                        <th>관리</th>
                    </tr>
                </thead>

                <tbody>
                    {boards.map(board => (
                        <tr key={board.id}>
                            <td>{board.id}</td>
                            <td>{board.writer}</td>
                            <td>{board.title}</td>
                            <td>{board.content}</td>
                            <td>
                                <button
                                    onClick={() => handleEdit(board)}
                                >
                                    수정
                                </button>

                                <button
                                    className="delete"
                                    onClick={() => handleDelete(board.id)}
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}

                    {boards.length === 0 && (
                        <tr>
                            <td colSpan="5">게시글이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
    );
}

export default BoardPage;