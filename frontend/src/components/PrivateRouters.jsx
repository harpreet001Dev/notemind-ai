
import { Navigate } from "react-router-dom"

export const PrivateRoutes = ({ children, auth = false }) => {
    const token = localStorage.getItem('accesstoken')
    if (!token && !auth) {
        return <Navigate to="/login" replace />
    }
    if(auth && token){
         return <Navigate to="/" replace />
    }
    return children
}