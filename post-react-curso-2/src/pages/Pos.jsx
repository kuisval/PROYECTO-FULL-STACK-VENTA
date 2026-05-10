import styled from "styled-components";
import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabase.config";

export function Pos() {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    const [exito, setExito] = useState(false);

    useEffect(() => {
        const fetchProductos = async () => {
            const { data } = await supabase.from('productos').select('*').order('nombre');
            setProductos(data || []);
            setLoading(false);
        };
        fetchProductos();
    }, []);

    const filtrados = productos.filter(p =>
        p.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const agregarAlCarrito = (producto) => {
        setCarrito(prev => {
            const existe = prev.find(i => i.id === producto.id);
            if (existe) return prev.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i);
            return [...prev, { ...producto, cantidad: 1 }];
        });
    };

    const cambiarCantidad = (id, delta) => {
        setCarrito(prev => prev
            .map(i => i.id === id ? { ...i, cantidad: i.cantidad + delta } : i)
            .filter(i => i.cantidad > 0)
        );
    };

    const total = carrito.reduce((acc, i) => acc + (i.precio_venta || 0) * i.cantidad, 0);

    const cobrar = async () => {
        if (!carrito.length) return;
        await supabase.from('ventas').insert({ total, items: JSON.stringify(carrito) });
        setCarrito([]);
        setExito(true);
        setTimeout(() => setExito(false), 2500);
    };

    return (
        <Container>
            <div className="productos-panel">
                <h2>Punto de Venta</h2>
                <input
                    className="buscar"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                />
                {loading ? <p>Cargando...</p> : (
                    <div className="grid-productos">
                        {filtrados.length === 0 && <p className="empty">Sin productos. Agrégalos en Configuración → Productos.</p>}
                        {filtrados.map(p => (
                            <div className="producto-card" key={p.id} onClick={() => agregarAlCarrito(p)}>
                                <h4>{p.nombre}</h4>
                                <span className="precio">${(p.precio_venta || 0).toFixed(2)}</span>
                                <span className="stock">Stock: {p.stock ?? 0}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="carrito-panel">
                <h2>Carrito</h2>
                {carrito.length === 0 && <p className="empty">Sin productos en el carrito</p>}
                {carrito.map(item => (
                    <div className="carrito-item" key={item.id}>
                        <div className="item-info">
                            <span className="nombre">{item.nombre}</span>
                            <span className="precio">${((item.precio_venta || 0) * item.cantidad).toFixed(2)}</span>
                        </div>
                        <div className="controles">
                            <button onClick={() => cambiarCantidad(item.id, -1)}>-</button>
                            <span>{item.cantidad}</span>
                            <button onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                        </div>
                    </div>
                ))}
                <div className="total">
                    <span>TOTAL</span>
                    <span className="monto">${total.toFixed(2)}</span>
                </div>
                {exito && <p className="exito">✅ Venta registrada</p>}
                <button className="cobrar" onClick={cobrar} disabled={!carrito.length}>COBRAR</button>
            </div>
        </Container>
    );
}

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 20px;
    padding: 24px;
    min-height: 100vh;
    padding-bottom: 80px;
    @media (max-width: 768px) { grid-template-columns: 1fr; }
    h2 { margin: 0 0 16px; font-size: 22px; font-weight: 800; }
    .buscar { width: 100%; padding: 12px; border: 2px solid ${({ theme }) => theme.color2}; border-radius: 12px; background: ${({ theme }) => theme.bg}; color: ${({ theme }) => theme.text}; font-size: 15px; margin-bottom: 16px; box-sizing: border-box; &:focus { outline: none; border-color: #1cb0f6; } }
    .grid-productos { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
    .producto-card { background: ${({ theme }) => theme.bg}; border: 2px solid ${({ theme }) => theme.color2}; border-radius: 14px; padding: 14px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 6px; &:hover { border-color: #1cb0f6; transform: translateY(-2px); } h4 { margin: 0; font-size: 14px; font-weight: 700; } .precio { font-size: 16px; font-weight: 900; color: #1cb0f6; } .stock { font-size: 12px; color: ${({ theme }) => theme.colorSubtitle}; } }
    .carrito-panel { background: ${({ theme }) => theme.bg}; border: 2px solid ${({ theme }) => theme.color2}; border-radius: 20px; padding: 20px; height: fit-content; position: sticky; top: 20px; display: flex; flex-direction: column; gap: 12px; }
    .carrito-item { border-bottom: 1px solid ${({ theme }) => theme.color2}; padding-bottom: 10px; .item-info { display: flex; justify-content: space-between; margin-bottom: 6px; } .nombre { font-size: 14px; font-weight: 600; } .precio { font-weight: 700; color: #1cb0f6; } .controles { display: flex; align-items: center; gap: 10px; button { width: 28px; height: 28px; border-radius: 50%; border: 2px solid ${({ theme }) => theme.color2}; background: ${({ theme }) => theme.bgAlpha}; color: ${({ theme }) => theme.text}; cursor: pointer; font-size: 16px; font-weight: 700; &:hover { background: #1cb0f6; color: #fff; border-color: #1cb0f6; } } } }
    .total { display: flex; justify-content: space-between; padding-top: 10px; font-weight: 800; font-size: 18px; .monto { color: #1cb0f6; font-size: 24px; } }
    .cobrar { width: 100%; padding: 14px; background: #1cb0f6; color: #fff; border: none; border-radius: 14px; font-size: 16px; font-weight: 900; cursor: pointer; transition: 0.2s; &:hover { background: #0a9fe0; } &:disabled { background: #ccc; cursor: not-allowed; } }
    .exito { color: #53B257; font-weight: 700; text-align: center; margin: 0; }
    .empty { color: ${({ theme }) => theme.colorSubtitle}; font-size: 14px; }
`;
