import styled from "styled-components";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase.config";
import { useNavigate } from "react-router-dom";

export function Usuarios() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargar = async () => {
            // Intentar tabla perfiles primero, si no existe mostrar usuario actual
            const { data } = await supabase.from('perfiles').select('*').order('created_at', { ascending: false });
            if (data) setUsuarios(data);
            else {
                const { data: session } = await supabase.auth.getUser();
                if (session?.user) setUsuarios([{ id: session.user.id, email: session.user.email, tipo: 'administrador', created_at: session.user.created_at }]);
            }
            setLoading(false);
        };
        cargar();
    }, []);

    return (
        <Container>
            <div className="header">
                <div className="titulo">
                    <button className="back" onClick={() => navigate('/configurar')}>← Volver</button>
                    <h2>Personal / Usuarios</h2>
                </div>
            </div>
            {loading ? <p>Cargando...</p> : usuarios.length === 0 ? (
                <p className="empty">Sin usuarios registrados.</p>
            ) : (
                <div className="lista">
                    {usuarios.map(u => (
                        <div className="item" key={u.id}>
                            <div className="avatar">{(u.email || u.nombre || '?')[0].toUpperCase()}</div>
                            <div className="info">
                                <span className="email">{u.email || u.nombre}</span>
                                <span className="tipo">{u.tipo || 'usuario'}</span>
                            </div>
                            <span className="fecha">{new Date(u.created_at).toLocaleDateString('es-MX')}</span>
                        </div>
                    ))}
                </div>
            )}
        </Container>
    );
}

const Container = styled.div`
    padding: 24px; min-height: 100vh; padding-bottom: 80px;
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .titulo { display: flex; align-items: center; gap: 14px; h2 { margin: 0; font-size: 22px; } }
    .back { background: none; border: 2px solid ${({ theme }) => theme.color2}; color: ${({ theme }) => theme.text}; padding: 8px 14px; border-radius: 10px; cursor: pointer; font-weight: 700; }
    .lista { display: flex; flex-direction: column; gap: 10px; }
    .item { background: ${({ theme }) => theme.bg}; border: 2px solid ${({ theme }) => theme.color2}; border-radius: 14px; padding: 16px; display: flex; align-items: center; gap: 14px; }
    .avatar { width: 44px; height: 44px; border-radius: 50%; background: #1cb0f6; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; flex-shrink: 0; }
    .info { flex: 1; display: flex; flex-direction: column; .email { font-weight: 700; } .tipo { font-size: 12px; color: ${({ theme }) => theme.colorSubtitle}; text-transform: uppercase; } }
    .fecha { font-size: 13px; color: ${({ theme }) => theme.colorSubtitle}; }
    .empty { color: ${({ theme }) => theme.colorSubtitle}; }
`;
