import axios from 'axios'
import endPoints from './endpoints.js'
import ApiError from '../utlis/ApiError.js'



const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URI}/api`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

const getToken = () => {
    return localStorage.getItem('accesstoken')
}

let refreshPromise = null;

const refreshAccessToken = async () => {
    if (!refreshPromise) {
        refreshPromise = api.post("/auth/refresh")
            .then(({ data }) => {
                const newToken = data.data?.accessToken;

                if (!newToken) {
                    throw new Error("No access token received");
                }

                localStorage.setItem("accesstoken", newToken);
                return newToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest.url.includes("/auth/login") ||
            originalRequest.url.includes("/auth/register") ||
            originalRequest.url.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const newToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            unauthorized();
            return Promise.reject(refreshError);
        }
    }
);
const unauthorized = () => {
    localStorage.removeItem('accesstoken')
    window.location.href = '/login'
}

const getHeader = (auth) => {
    const headers = {}
    if (auth) {
        headers.Authorization = `Bearer ${getToken()}`
    }
    return headers;

}

const handleError = (error) => {


    // No response = network/server unavailable
    if (!error.response) {
        throw new ApiError(
            "Unable to connect to server. Please try again."
        );
    }

    const { status, data } = error.response;
    // Backend validation errors
    if (data.errors?.length) {
        throw new ApiError(
            data.message || "Validation error",
            data.errors,
            status
        );
    }

    // Normal API error
    throw new ApiError(
        data.message || "Something went wrong",
        [],
        status
    );
};

export const post = async (url, data = {}, auth = false) => {
    try {
        const res = await api.post(url, data, {
            headers: getHeader(auth)
        })
        return res.data;
    } catch (error) {
        handleError(error)
    }
}

export const get = async (url, auth = false, params = {}) => {
    try {
        const res = await api.get(url, {
            params,
            headers: getHeader(auth)
        })
        return res.data;
    } catch (error) {
        handleError(error)
    }
}

export const del = async (url, auth = false) => {
    try {
        const res = await api.delete(url, {
            headers: getHeader(auth)
        })
        return res.data;
    } catch (error) {
        handleError(error)
    }
}

const Login = (data) => {
    return post(endPoints.LOGIN.url, data, endPoints.LOGIN.auth)
}
const Register = (data) => {
    return post(endPoints.REGISTER.url, data, endPoints.REGISTER.auth)
}

const GetNotes = (params) => {
    return get(endPoints.GET_NOTES.url, endPoints.GET_NOTES.auth, params)
}
const AddNote = (data) => {
    return post(endPoints.ADD_NOTE.url, data, endPoints.ADD_NOTE.auth, {})
}
const updateNote = (data) => {
    return post(endPoints.UPDATE_NOTE.url, data, endPoints.UPDATE_NOTE.auth, {})
}
const deleteNote = (noteId) => {
    return del(`${endPoints.DELETE_NOTE.url}/${noteId}`, endPoints.DELETE_NOTE.auth)
}
const askQuery=async(data)=>{
    return post(endPoints.ASK_QUERY.url,data,endPoints.ASK_QUERY.auth)
}
export default {
    Login,
    Register,
    GetNotes,
    AddNote,
    updateNote,
    deleteNote,
    askQuery
}
