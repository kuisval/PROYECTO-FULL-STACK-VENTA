import styled from "styled-components";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase.config";
import { useNavigate } from "react-router-dom";

const FORM_VACIO = { nombre: '', precio_compra: '', precio_venta: '', stock: '', stock_minimo: '', categoria_id: '', marca_id: '' };

export function Productos() {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [form, setForm] = useState(FORM_VACIO);
    const [editando, setEditando] = useState(null);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const cargar = async () => {
        const [{ data: prods }, { data: cats }, { data: mrcs }] = await Promise.all([
            supabase.from('productos').select('*, categorias(nombre), marcas(nombre)').order('nombre'),
            supabase.from('categorias').select('*'),
            supabase.from('marcas').select('*'),
        ]);
        setProductos(prods || []);
        setCategorias(cats || []);
        setMarcas(mrcs || []);
        setLoading(false);
    };

    useEffect(() => { cargar(); }, []);

    const abrirModal = (p = null) => {
        setEditando(p);
        setForm(p ? { nombre: p.nombre, precio_compra: p.precio_compra, precio_venta: p.precio_venta, stock: p.stock, stock_minimo: p.stock_minimo, categoria_id: p.categoria_id || '', marca_id: p.marca_id || '' } : FORM_VACIO);
        setModal(true);
    };

    const guardar = async () => {
        setGuardando(true);
        const datos = { ...form, precio_compra: +form.precio_compra, precio_venta: +form.precio_venta, stock: +form.stock, stock_minimo: +form.stock_minimo };
        if (editando) {
            await supabase.from('productos').update(datos).eq('id', editando.id);
        } else {
            await supabase.from('productos').insert(datos);
        }
        await cargar();
        setModal(false);
        setGuardando(false);
    };

    const eliminar = async (id) => {
        if (!confirm('¿Eliminar este producto?')) return;
        await supabase.from('productos').delete().eq('id', id);
        await cargar();
    };

    return (
        <Container>
            <div className="header">
                <div className="titulo">
                    <button className="back" onClick={() => navigate('/configurar')}>← Volver</button>
                    <h2>Productos</h2>
                </div>
                <button className="btn-add" onClick={() => abrirModal()}>+ Agregar</button>
            </div>

            {loading ? <p>Cargando...</p> : (
                productos.length === 0 ? (
                    <p className="empty">Sin productos. Crea tu primer producto.</p>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th><th>Categoría</th><th>Marca</th>
                                    <th>P. Compra</th><th>P. Venta</th><th>Stock</th><th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map(p => (
                                    <tr key={p.id}>
                                        <td className="bold">{p.nombre}</td>
                                        <td>{p.categorias?.nombre || '—'}</td>
                                        <td>{p.marcas?.nombre || '—'}</td>
                                        <td>${(p.precio_compra || 0).toFixed(2)}</td>
                                        <td>${(p.precio_venta || 0).toFixed(2)}</td>
                                        <td>{p.stock ?? 0}</td>
                                        <td className="acciones">
                                            <button className="edit" onClick={() => abrirModal(p)}>✏️</button>
                                            <button className="del" onClick={() => eliminar(p.id)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}

            {modal && (
                <div className="overlay" onClick={() => setModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>{editando ? 'Editar producto' : 'Nuevo producto'}</h3>
                        {[
                            { key: 'nombre', label: 'Nombre', type: 'text' },
                            { key: 'precio_compra', label: 'Precio compra', type: 'number' },
                            { key: 'precio_venta', label: 'Precio venta', type: 'number' },
                            { key: 'stock', label: 'Stock inicial', type: 'number' },
                            { key: 'stock_minimo', label: 'Stock mínimo', type: 'number' },
                        ].map(({ key, label, type }) => (
                            <div className="field" key={key}>
                                <label>{label}</label>
                                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                            </div>
                        ))}
                        <div className="field">
                            <label>Categoría</label>
                            <select value={form.categoria_id} onChange={e => setForm(f => ({ ...f, categoria_id: e.target.value }))}>
                                <option value="">— Sin categoría —</option>
                                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                        </div>
                        <div className="field">
                            <label>Marca</label>
                            <select value={form.marca_id} onChange={e => setForm(f => ({ ...f, marca_id: e.target.value }))}>
                                <option value="">— Sin marca —</option>
                                {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button className="cancel" onClick={() => setModal(false)}>Cancelar</button>
                            <button className="save" onClick={guardar} disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar'}</button>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
}

const Container = styled.div`
    padding: 24px;
    min-height: 100vh;
    padding-bottom: 80px;
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .titulo { display: flex; align-items: center; gap: 14px; h2 { margin: 0; font-size: 22px; } }
    .back { background: none; border: 2px solid ${({ theme }) => theme.color2}; color: ${({ theme }) => theme.text}; padding: 8px 14px; border-radius: 10px; cursor: pointer; font-weight: 700; }
    .btn-add { background: #1cb0f6; color: #fff; border: none; padding: 10px 20px; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 15px; }
    .empty { color: ${({ theme }) => theme.colorSubtitle}; }
    .table-wrapper { overflow-x: auto; background: ${({ theme }) => theme.bg}; border: 2px solid ${({ theme }) => theme.color2}; border-radius: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 14px;
        th { padding: 14px 16px; text-align: left; border-bottom: 2px solid ${({ theme }) => theme.color2}; font-weight: 700; color: ${({ theme }) => theme.colorSubtitle}; }
        td { padding: 12px 16px; border-bottom: 1px solid ${({ theme }) => theme.color2}; &.bold { font-weight: 700; } }
        tr:last-child td { border-bottom: none; }
    }
    .acciones { display: flex; gap: 8px; button { background: none; border: none; cursor: pointer; font-size: 18px; padding: 2px; } }
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 200; }
    .modal { background: ${({ theme }) => theme.bg}; border-radius: 20px; padding: 28px; width: 100%; max-width: 480px; max-height: 85vh; overflow-y: auto;
        h3 { margin: 0 0 20px; font-size: 20px; }
    }
    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px;
        label { font-size: 13px; font-weight: 700; color: ${({ theme }) => theme.colorSubtitle}; }
        input, select { padding: 10px 12px; border: 2px solid ${({ theme }) => theme.color2}; border-radius: 10px; background: ${({ theme }) => theme.bg}; color: ${({ theme }) => theme.text}; font-size: 15px; &:focus { outline: none; border-color: #1cb0f6; } }
    }
    .modal-actions { display: flex; gap: 12px; margin-top: 8px;
        button { flex: 1; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 15px; cursor: pointer; border: none; }
        .cancel { background: ${({ theme }) => theme.bgAlpha}; color: ${({ theme }) => theme.text}; }
        .save { background: #1cb0f6; color: #fff; &:disabled { background: #ccc; } }
    }
`;
