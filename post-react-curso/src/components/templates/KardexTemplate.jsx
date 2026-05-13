import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/supabase.config';

const getEstado = (stock, minimo) => {
    if (stock <= 0)             return { label: 'Sin stock',  color: '#F54E41' };
    if (stock <= (minimo || 5)) return { label: 'Stock bajo', color: '#f0a500' };
    return                             { label: 'OK',         color: '#53B257' };
};

export function KardexTemplate() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [busqueda, setBusqueda]   = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase
                .from('productos')
                .select('*, categorias(nombre), marcas(nombre)')
                .order('nombre');
            setProductos(data || []);
            setLoading(false);
        };
        fetchData();
    }, []);

    const filtrados = productos.filter(p =>
        p.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

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

            {loading && <p className="empty">Cargando...</p>}

            {!loading && filtrados.length === 0 && (
                <p className="empty">Sin productos. Agrégalos en Configuración → Productos.</p>
            )}

            {!loading && filtrados.length > 0 && (<>

                {/* ── TARJETAS — solo en móvil ── */}
                <div className="cards">
                    {filtrados.map(p => {
                        const estado = getEstado(p.stock, p.stock_minimo);
                        return (
                            <div className="card" key={p.id}>
                                <div className="card-top">
                                    <span className="card-nombre">{p.nombre}</span>
                                    <span className="badge" style={{ background: estado.color + '22', color: estado.color }}>
                                        {estado.label}
                                    </span>
                                </div>
                                <div className="card-body">
                                    {[
                                        { label: 'Categoría',  valor: p.categorias?.nombre || '—' },
                                        { label: 'Marca',      valor: p.marcas?.nombre    || '—' },
                                        { label: 'Stock',      valor: p.stock ?? 0,       highlight: true },
                                        { label: 'Mínimo',     valor: p.stock_minimo ?? '—' },
                                        { label: 'P. Compra',  valor: `$${(p.precio_compra || 0).toFixed(2)}` },
                                        { label: 'P. Venta',   valor: `$${(p.precio_venta  || 0).toFixed(2)}`, highlight: true },
                                    ].map(({ label, valor, highlight }) => (
                                        <div className={`dato${highlight ? ' highlight' : ''}`} key={label}>
                                            <span className="dato-label">{label}</span>
                                            <span>{valor}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── TABLA — solo en desktop ── */}
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th><th>Categoría</th><th>Marca</th>
                                <th>Stock</th><th>Mínimo</th><th>P. Compra</th><th>P. Venta</th><th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrados.map(p => {
                                const estado = getEstado(p.stock, p.stock_minimo);
                                return (
                                    <tr key={p.id}>
                                        <td className="nombre">{p.nombre}</td>
                                        <td>{p.categorias?.nombre || '—'}</td>
                                        <td>{p.marcas?.nombre    || '—'}</td>
                                        <td className="numero">{p.stock ?? 0}</td>
                                        <td className="numero">{p.stock_minimo ?? '—'}</td>
                                        <td className="numero">${(p.precio_compra || 0).toFixed(2)}</td>
                                        <td className="numero">${(p.precio_venta  || 0).toFixed(2)}</td>
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

            </>)}
        </Container>
    );
}

const Container = styled.div`
    padding: 20px 16px;
    min-height: 100vh;
    padding-bottom: 90px;

    .header {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 20px;
        h2 { margin: 0; font-size: 20px; font-weight: 800; }
        @media (min-width: 768px) { flex-direction: row; justify-content: space-between; align-items: center; }
    }

    .buscar {
        width: 100%; padding: 10px 14px;
        border: 2px solid ${({ theme }) => theme.color2};
        border-radius: 12px;
        background: ${({ theme }) => theme.bg};
        color: ${({ theme }) => theme.text};
        font-size: 15px; box-sizing: border-box;
        &:focus { outline: none; border-color: #1cb0f6; }
        @media (min-width: 768px) { width: 240px; }
    }

    /* ── TARJETAS: visibles solo en móvil ── */
    .cards {
        display: flex; flex-direction: column; gap: 12px;
        @media (min-width: 768px) { display: none; }
    }

    .card {
        background: ${({ theme }) => theme.bg};
        border: 2px solid ${({ theme }) => theme.color2};
        border-radius: 16px; padding: 14px;

        .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .card-nombre { font-weight: 800; font-size: 15px; }
        .card-body { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

        .dato {
            display: flex; flex-direction: column; gap: 2px;
            .dato-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${({ theme }) => theme.colorSubtitle}; letter-spacing: 0.3px; }
            span:last-child { font-size: 14px; font-weight: 600; }
            &.highlight span:last-child { color: #1cb0f6; font-weight: 800; }
        }
    }

    /* ── TABLA: visible solo en desktop ── */
    .table-wrapper {
        display: none;
        @media (min-width: 768px) {
            display: block; overflow-x: auto;
            background: ${({ theme }) => theme.bg};
            border-radius: 16px;
            border: 2px solid ${({ theme }) => theme.color2};
        }
    }

    table {
        width: 100%; border-collapse: collapse; font-size: 14px;
        th { text-align: left; padding: 14px 16px; border-bottom: 2px solid ${({ theme }) => theme.color2}; font-weight: 700; color: ${({ theme }) => theme.colorSubtitle}; white-space: nowrap; }
        td { padding: 12px 16px; border-bottom: 1px solid ${({ theme }) => theme.color2}; &.nombre { font-weight: 600; } &.numero { font-weight: 700; color: #1cb0f6; } }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: ${({ theme }) => theme.bgAlpha}; }
    }

    .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; white-space: nowrap; }
    .empty { color: ${({ theme }) => theme.colorSubtitle}; }
`;