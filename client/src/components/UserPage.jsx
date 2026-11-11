import { useEffect, useState } from 'react';
import { userApi } from '../api/api';

function UserPage() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    // 회원 조회
    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await userApi.list();
            setUsers(data);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // 입력값 변경
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
            if (editId) {
                await userApi.update(editId, form);
                alert('회원 수정 완료');
            } else {
                await userApi.create(form);
                alert('회원 등록 완료');
            }

            resetForm();
            await loadUsers();
        } catch (error) {
            alert(error.message);
        }
    };

    // 수정 선택
    const handleEdit = (user) => {
        setEditId(user.id);

        setForm({
            name: user.name,
            email: user.email,
            phone: user.phone || ''
        });
    };

    // 삭제
    const handleDelete = async (id) => {
        if (!window.confirm('회원을 삭제하시겠습니까?')) return;

        try {
            await userApi.remove(id);
            alert('회원 삭제 완료');
            await loadUsers();
        } catch (error) {
            alert(error.message);
        }
    };

    // 초기화
    const resetForm = () => {
        setEditId(null);
        setForm({
            name: '',
            email: '',
            phone: ''
        });
    };

    return (
        <div className="page">

            <h2>회원 관리</h2>

            <form onSubmit={handleSubmit} className="form">

                <input
                    name="name"
                    placeholder="이름"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="email"
                    type="email"
                    placeholder="이메일"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <input
                    name="phone"
                    placeholder="전화번호"
                    value={form.phone}
                    onChange={handleChange}
                />

                <button type="submit">
                    {editId ? '수정하기' : '회원 등록'}
                </button>

                <button type="button" onClick={resetForm}>
                    초기화
                </button>

            </form>

            <h3>회원 목록</h3>

            {loading ? (
                <p>조회 중...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>전화번호</th>
                            <th>관리</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone || '-'}</td>
                                <td>
                                    <button
                                        onClick={() => handleEdit(user)}
                                    >
                                        수정
                                    </button>

                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="delete"
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {users.length === 0 && (
                            <tr>
                                <td colSpan="5">회원이 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

        </div>
    );
}

export default UserPage;