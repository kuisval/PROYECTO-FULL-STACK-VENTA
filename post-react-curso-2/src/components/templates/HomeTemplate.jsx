import styled from 'styled-components';
import { useAuthStore } from "../../store/AuthStore";
import { UserAuth } from "../../context/AuthContent";
import { v } from "../../styles/variables";
import { supabase } from "../../supabase/supabase.config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataModulosConfiguracion } from "../../utils/dataEstatica";

export function HomeTemplate() {
    const { cerrarSesion } = useAuthStore();
    const { user } = UserAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ ventas: 0, productos: 0, alertas: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            const [{ count: ventas }, { count: productos }] = await Promise.all([
                supabase.from('ventas').select('*', { count: 'exact', head: true }),
                supabase.from('productos').select('*', { count: 'exact', head: true }),
            ]);
            setStats({ ventas: ventas || 0, productos: productos || 0, alertas: 0 });
        };
        fetchStats().catch(() => {});
    }, []);

    const handleCerrar = async () => {
        await cerrarSesion();
        navigate('/login');
    };

    const statsCards = [
        { titulo: 'Ventas hoy', valor: stats.ventas, color: '#1cb0f6', icono: <v.iconoreportes /> },
        { titulo: 'Productos', valor: stats.productos, color: '#9046FF', icono: <v.iconostock /> },
        { titulo: 'Stock bajo', valor: stats.alertas, color: '#F54E41', icono: <v.iconostockminimo /> },
    ];

    return (
        <Container>
            <header className="header">
                <div>
                    <h1>Bienvenido 👋</h1>
                    <p>{user?.email}</p>
                </div>
                <button className="logout" onClick={handleCerrar}>
                    <v.iconoCerrarSesion /> Salir
                </button>
            </header>

            <div className="stats">
                {statsCards.map(({ titulo, valor, color, icono }) => (
                    <div className="stat-card" key={titulo} style={{ borderLeft: `4px solid ${color}` }}>
                        <div className="stat-icon" style={{ color }}>{icono}</div>
                        <div>
                            <p className="stat-label">{titulo}</p>
                            <h2 className="stat-valor">{valor}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="section-title">Módulos del sistema</h2>
            <div className="modulos">
                {DataModulosConfiguracion.map(({ title, subtitle, icono, link }) => (
                    <div className="modulo-card" key={title} onClick={() => navigate(link)}>
                        <img src={icono} alt={title} />
                        <div>
                            <h3>{title}</h3>
                            <p>{subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Container>
    );
}

const Container = styled.div`
    padding: 30px;
    min-height: 100vh;
    padding-bottom: 80px;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 30px;
        h1 { margin: 0; font-size: 28px; }
        p { margin: 4px 0 0; color: ${({ theme }) => theme.colorSubtitle}; font-size: 14px; }
        .logout {
            display: flex;
            align-items: center;
            gap: 8px;
            background: ${({ theme }) => theme.bg};
            border: 2px solid ${({ theme }) => theme.color2};
            color: ${({ theme }) => theme.text};
            padding: 10px 18px;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 700;
            font-size: 14px;
            &:hover { background: ${({ theme }) => theme.bgAlpha}; }
        }
    }

    .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin-bottom: 36px;
    }

    .stat-card {
        background: ${({ theme }) => theme.bg};
        border-radius: 16px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        box-shadow: ${() => v.boxshadowGray};
        .stat-icon { font-size: 36px; }
        .stat-label { margin: 0; font-size: 13px; color: ${({ theme }) => theme.colorSubtitle}; }
        .stat-valor { margin: 4px 0 0; font-size: 28px; font-weight: 900; }
    }

    .section-title {
        font-size: 20px;
        font-weight: 800;
        margin-bottom: 16px;
    }

    .modulos {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 16px;
    }

    .modulo-card {
        background: ${({ theme }) => theme.bg};
        border: 1px solid ${({ theme }) => theme.color2};
        border-radius: 16px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 14px;
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
            border-color: ${({ theme }) => theme.color1};
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }
        img { width: 44px; height: 44px; object-fit: contain; }
        h3 { margin: 0; font-size: 15px; font-weight: 700; }
        p { margin: 4px 0 0; font-size: 12px; color: ${({ theme }) => theme.colorSubtitle}; }
    }
`;
