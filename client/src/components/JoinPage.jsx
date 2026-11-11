import { useEffect, useState } from 'react';
import { joinApi } from '../api/api';

function JoinPage() {
    const [userPosts, setUserPosts] = useState([]);
    const [postComments, setPostComments] = useState([]);

    const loadData = async () => {
        try {
            const [result1, result2] = await Promise.all([
                joinApi.userPosts(),
                joinApi.postComments()
            ]);

            setUserPosts(result1);
            setPostComments(result2);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="page">

            <h2>JOIN 조회 결과</h2>

            <h3>1. 회원 + 게시글 JOIN</h3>

            <table>
                <thead>
                    <tr>
                        <th>회원번호</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>게시글번호</th>
                        <th>제목</th>
                    </tr>
                </thead>

                <tbody>
                    {userPosts.map((row, index) => (
                        <tr key={`${row.user_id}-${row.post_id}-${index}`}>
                            <td>{row.user_id}</td>
                            <td>{row.name}</td>
                            <td>{row.email}</td>
                            <td>{row.post_id}</td>
                            <td>{row.title}</td>
                        </tr>
                    ))}

                    {userPosts.length === 0 && (
                        <tr>
                            <td colSpan="5">조회 결과가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h3>2. 게시글 + 댓글 JOIN</h3>

            <table>
                <thead>
                    <tr>
                        <th>게시글번호</th>
                        <th>게시글 제목</th>
                        <th>댓글번호</th>
                        <th>댓글 내용</th>
                    </tr>
                </thead>

                <tbody>
                    {postComments.map((row, index) => (
                        <tr key={`${row.post_id}-${row.comment_id ?? 'none'}-${index}`}>
                            <td>{row.post_id}</td>
                            <td>{row.title}</td>
                            <td>{row.comment_id ?? '-'}</td>
                            <td>{row.comment ?? '댓글 없음'}</td>
                        </tr>
                    ))}

                    {postComments.length === 0 && (
                        <tr>
                            <td colSpan="4">조회 결과가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
    );
}

export default JoinPage;