import styled from "styled-components";
import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabase.config";

export function Kardex() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase
                .from('productos')
                .select('*, categorias(nombre), marcas(nombre)')
                .order('nombre');
            setProductos(data || []);
            setLoading(false);
        };
        fetch();
    }, []);

    const filtrados = productos.filter(p =>
        p.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const getEstadoStock = (stock, minimo) => {
        if (stock <= 0) return { label: 'Sin stock', color: '#F54E41' };
        if (stock <= (minimo || 5)) return { label: 'Stock bajo', color: '#f0a500' };
        return { label: 'OK', color: '#53B257' };
    };

    return (
        <Container>
            <div className="header">
                <h2>Kardex / Inventario</h2>
                <input
                    className="buscar"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                />
            </div>

            {loading ? <p>Cargando...</p> : (
                filtrados.length === 0 ? (
                    <p className="empty">Sin productos. Agrégalos en Configuración → Productos.</p>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Marca</th>
                                    <th>Stock</th>
                                    <th>Mínimo</th>
                                    <th>P. Compra</th>
                                    <th>P. Venta</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrados.map(p => {
                                    const estado = getEstadoStock(p.stock, p.stock_minimo);
                                    return (
                                        <tr key={p.id}>
                                            <td className="nombre">{p.nombre}</td>
                                            <td>{p.categorias?.nombre || '—'}</td>
                                            <td>{p.marcas?.nombre || '—'}</td>
                                            <td className="numero">{p.stock ?? 0}</td>
                                            <td className="numero">{p.stock_minimo ?? '—'}</td>
                                            <td className="numero">${(p.precio_compra || 0).toFixed(2)}</td>
                                            <td className="numero">${(p.precio_venta || 0).toFixed(2)}</td>
                                            <td>
                                                <span className="badge" style={{ background: estado.color + '22', color: estado.color }}>
                                                    {estado.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
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

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 12px;
        h2 { margin: 0; font-size: 22px; font-weight: 800; }
    }

    .buscar {
        padding: 10px 16px;
        border: 2px solid ${({ theme }) => theme.color2};
        border-radius: 12px;
        background: ${({ theme }) => theme.bg};
        color: ${({ theme }) => theme.text};
        font-size: 14px;
        min-width: 220px;
        &:focus { outline: none; border-color: #1cb0f6; }
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
            white-space: nowrap;
        }

        td {
            padding: 12px 16px;
            border-bottom: 1px solid ${({ theme }) => theme.color2};
            &.nombre { font-weight: 600; }
            &.numero { font-weight: 700; color: #1cb0f6; }
        }

        tr:last-child td { border-bottom: none; }
        tr:hover td { background: ${({ theme }) => theme.bgAlpha}; }
    }

    .badge {
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
    }

    .empty { color: ${({ theme }) => theme.colorSubtitle}; }
`;
