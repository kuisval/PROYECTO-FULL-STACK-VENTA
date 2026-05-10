import styled from "styled-components";
import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabase.config";

export function Reportes() {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase
                .from('ventas')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);
            setVentas(data || []);
            setLoading(false);
        };
        fetch();
    }, []);

    const totalVentas = ventas.reduce((acc, v) => acc + (v.total || 0), 0);
    const promedioVenta = ventas.length ? totalVentas / ventas.length : 0;
    const ventaMax = ventas.length ? Math.max(...ventas.map(v => v.total || 0)) : 0;

    const stats = [
        { label: 'Total de ventas', valor: ventas.length, color: '#1cb0f6' },
        { label: 'Ingresos totales', valor: `$${totalVentas.toFixed(2)}`, color: '#53B257' },
        { label: 'Promedio por venta', valor: `$${promedioVenta.toFixed(2)}`, color: '#9046FF' },
        { label: 'Venta más alta', valor: `$${ventaMax.toFixed(2)}`, color: '#f0a500' },
    ];

    return (
        <Container>
            <h2>Reportes de Ventas</h2>

            <div className="stats-grid">
                {stats.map(({ label, valor, color }) => (
                    <div className="stat-card" key={label} style={{ borderTop: `4px solid ${color}` }}>
                        <p className="label">{label}</p>
                        <h3 className="valor" style={{ color }}>{valor}</h3>
                    </div>
                ))}
            </div>

            <h3 className="subtitulo">Últimas ventas</h3>

            {loading ? <p>Cargando...</p> : (
                ventas.length === 0 ? (
                    <p className="empty">Sin ventas registradas aún. Usa el POS para registrar ventas.</p>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventas.map((v, i) => (
                                    <tr key={v.id}>
                                        <td>{i + 1}</td>
                                        <td>{new Date(v.created_at).toLocaleString('es-MX')}</td>
                                        <td className="total">${(v.total || 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </Container>
    );
}

const Container = styled.div`
    padding: 24px;
    min-height: 100vh;
    padding-bottom: 80px;

    h2 { margin: 0 0 24px; font-size: 22px; font-weight: 800; }
    .subtitulo { margin: 30px 0 14px; font-size: 18px; }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 16px;
        margin-bottom: 10px;
    }

    .stat-card {
        background: ${({ theme }) => theme.bg};
        border: 2px solid ${({ theme }) => theme.color2};
        border-radius: 16px;
        padding: 20px;
        .label { margin: 0 0 8px; font-size: 13px; color: ${({ theme }) => theme.colorSubtitle}; }
        .valor { margin: 0; font-size: 26px; font-weight: 900; }
    }

    .table-wrapper {
        overflow-x: auto;
        background: ${({ theme }) => theme.bg};
        border-radius: 16px;
        border: 2px solid ${({ theme }) => theme.color2};
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
        th {
            text-align: left;
            padding: 14px 16px;
            border-bottom: 2px solid ${({ theme }) => theme.color2};
            font-weight: 700;
            color: ${({ theme }) => theme.colorSubtitle};
        }
        td {
            padding: 12px 16px;
            border-bottom: 1px solid ${({ theme }) => theme.color2};
            &.total { font-weight: 900; color: #53B257; }
        }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: ${({ theme }) => theme.bgAlpha}; }
    }

    .empty { color: ${({ theme }) => theme.colorSubtitle}; }
`;
