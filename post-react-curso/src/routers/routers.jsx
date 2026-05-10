import { Routes, Route, Navigate } from 'react-router-dom';
import { Home, Login, Pos, Kardex, Reportes, Configurar, Productos, Categorias, Marca, Usuarios, Empresa } from '../index';
import { ProtectedRoute } from '../components/organismos/ProtectedRoute';

export function MyRouters() {
    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path='/pos' element={<ProtectedRoute><Pos /></ProtectedRoute>} />
            <Route path='/kardex' element={<ProtectedRoute><Kardex /></ProtectedRoute>} />
            <Route path='/reportes' element={<ProtectedRoute><Reportes /></ProtectedRoute>} />
            <Route path='/configurar' element={<ProtectedRoute><Configurar /></ProtectedRoute>} />
            <Route path='/configurar/productos' element={<ProtectedRoute><Productos /></ProtectedRoute>} />
            <Route path='/configurar/categorias' element={<ProtectedRoute><Categorias /></ProtectedRoute>} />
            <Route path='/configurar/marca' element={<ProtectedRoute><Marca /></ProtectedRoute>} />
            <Route path='/configurar/usuarios' element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
            <Route path='/configurar/empresa' element={<ProtectedRoute><Empresa /></ProtectedRoute>} />
            <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
    )
}
