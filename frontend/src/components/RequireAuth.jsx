import { useLocation, Navigate } from "react-router-dom";

function RequireAuth({ children }) {
    const location = useLocation()
    const userToken = sessionStorage.getItem('userToken')
    if (userToken) {
        return children
    } else {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
}
export default RequireAuth