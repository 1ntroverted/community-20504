const API = import.meta.env.VITE_API_URL;

const request = async (url, options = {}) => {
    try {
        const response = await fetch(`${API}${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || '서버 요청 실패');
        }

        return data;

    } catch (error) {
        console.error('API 요청 오류:', error);
        throw error;
    }
};

// 회원 CRUD
export const userApi = {
    list: () => request('/users'),

    detail: (id) => request(`/users/${id}`),

    create: (data) => request('/users', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    update: (id, data) => request(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    remove: (id) => request(`/users/${id}`, {
        method: 'DELETE'
    })
};

// 게시글 CRUD
export const boardApi = {
    list: () => request('/boards'),

    detail: (id) => request(`/boards/${id}`),

    create: (data) => request('/boards', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    update: (id, data) => request(`/boards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    remove: (id) => request(`/boards/${id}`, {
        method: 'DELETE'
    })
};

// JOIN
export const joinApi = {
    userPosts: () => request('/join/user-posts'),

    postComments: () => request('/join/post-comments')
};