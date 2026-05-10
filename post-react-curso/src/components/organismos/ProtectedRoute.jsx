import { Navigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContent";

export function ProtectedRoute({ children }) {
    const { user, loading } = UserAuth();

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <span>Cargando...</span>
        </div>
    );

    if (!user) return <Navigate to="/login" replace />;

    return children;
}
