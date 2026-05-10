import styled from "styled-components";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase.config";
import { useNavigate } from "react-router-dom";

export function Categorias() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [nombre, setNombre] = useState('');
    const [editando, setEditando] = useState(null);
    const [loading, setLoading] = useState(true);

    const cargar = async () => {
        const { data } = await supabase.from('categorias').select('*').order('nombre');
        setItems(data || []);
        setLoading(false);
    };

    useEffect(() => { cargar(); }, []);

    const guardar = async () => {
        if (!nombre.trim()) return;
        if (editando) {
            await supabase.from('categorias').update({ nombre }).eq('id', editando.id);
        } else {
            await supabase.from('categorias').insert({ nombre });
        }
        setNombre(''); setEditando(null);
        await cargar();
    };

    const eliminar = async (id) => {
        if (!confirm('¿Eliminar categoría?')) return;
        await supabase.from('categorias').delete().eq('id', id);
        await cargar();
    };

    const editar = (item) => { setEditando(item); setNombre(item.nombre); };

    return (
        <Container>
            <div className="header">
                <div className="titulo">
                    <button className="back" onClick={() => navigate('/configurar')}>← Volver</button>
                    <h2>Categorías</h2>
                </div>
            </div>
            <div className="form-inline">
                <input placeholder="Nombre de categoría" value={nombre} onChange={e => setNombre(e.target.value)} onKeyDown={e => e.key === 'Enter' && guardar()} />
                <button onClick={guardar}>{editando ? 'Actualizar' : 'Agregar'}</button>
                {editando && <button className="cancel" onClick={() => { setEditando(null); setNombre(''); }}>Cancelar</button>}
            </div>
            {loading ? <p>Cargando...</p> : items.length === 0 ? <p className="empty">Sin categorías aún.</p> : (
                <div className="lista">
                    {items.map(item => (
                        <div className="item" key={item.id}>
                            <span>{item.nombre}</span>
                            <div className="actions">
                                <button onClick={() => editar(item)}>✏️</button>
                                <button onClick={() => eliminar(item.id)}>🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Container>
    );
}

const Container = styled.div`
    padding: 24px; min-height: 100vh; padding-bottom: 80px;
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .titulo { display: flex; align-items: center; gap: 14px; h2 { margin: 0; font-size: 22px; } }
    .back { background: none; border: 2px solid ${({ theme }) => theme.color2}; color: ${({ theme }) => theme.text}; padding: 8px 14px; border-radius: 10px; cursor: pointer; font-weight: 700; }
    .form-inline { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;
        input { flex: 1; min-width: 200px; padding: 12px; border: 2px solid ${({ theme }) => theme.color2}; border-radius: 12px; background: ${({ theme }) => theme.bg}; color: ${({ theme }) => theme.text}; font-size: 15px; &:focus { outline: none; border-color: #1cb0f6; } }
        button { padding: 12px 20px; background: #1cb0f6; color: #fff; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; &.cancel { background: ${({ theme }) => theme.bgAlpha}; color: ${({ theme }) => theme.text}; } }
    }
    .lista { display: flex; flex-direction: column; gap: 10px; }
    .item { background: ${({ theme }) => theme.bg}; border: 2px solid ${({ theme }) => theme.color2}; border-radius: 12px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; font-weight: 600; }
    .actions { display: flex; gap: 8px; button { background: none; border: none; cursor: pointer; font-size: 18px; } }
    .empty { color: ${({ theme }) => theme.colorSubtitle}; }
`;
