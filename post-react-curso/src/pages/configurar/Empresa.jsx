import styled from "styled-components";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase.config";
import { useNavigate } from "react-router-dom";

const CAMPOS = [
    { key: 'nombre', label: 'Nombre de la empresa', type: 'text' },
    { key: 'ruc', label: 'RFC / RUC', type: 'text' },
    { key: 'direccion', label: 'Dirección', type: 'text' },
    { key: 'telefono', label: 'Teléfono', type: 'tel' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'ciudad', label: 'Ciudad', type: 'text' },
];

export function Empresa() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ nombre: '', ruc: '', direccion: '', telefono: '', email: '', ciudad: '' });
    const [guardando, setGuardando] = useState(false);
    const [exito, setExito] = useState(false);

    useEffect(() => {
        const cargar = async () => {
            const { data } = await supabase.from('empresa').select('*').single();
            if (data) setForm(data);
        };
        cargar().catch(() => {});
    }, []);

    const guardar = async () => {
        setGuardando(true);
        const { data } = await supabase.from('empresa').select('id').single();
        if (data?.id) {
            await supabase.from('empresa').update(form).eq('id', data.id);
        } else {
            await supabase.from('empresa').insert(form);
        }
        setGuardando(false);
        setExito(true);
        setTimeout(() => setExito(false), 2000);
    };

    return (
        <Container>
            <div className="header">
                <div className="titulo">
                    <button className="back" onClick={() => navigate('/configurar')}>← Volver</button>
                    <h2>Datos de la Empresa</h2>
                </div>
            </div>
            <div className="card">
                <div className="grid">
                    {CAMPOS.map(({ key, label, type }) => (
                        <div className="field" key={key}>
                            <label>{label}</label>
                            <input type={type} value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                        </div>
                    ))}
                </div>
                {exito && <p className="exito">✅ Datos guardados correctamente</p>}
                <button className="save" onClick={guardar} disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </div>
        </Container>
    );
}

const Container = styled.div`
    padding: 24px; min-height: 100vh; padding-bottom: 80px;
    .header { margin-bottom: 24px; }
    .titulo { display: flex; align-items: center; gap: 14px; h2 { margin: 0; font-size: 22px; } }
    .back { background: none; border: 2px solid ${({ theme }) => theme.color2}; color: ${({ theme }) => theme.text}; padding: 8px 14px; border-radius: 10px; cursor: pointer; font-weight: 700; }
    .card { background: ${({ theme }) => theme.bg}; border: 2px solid ${({ theme }) => theme.color2}; border-radius: 20px; padding: 28px; max-width: 700px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-bottom: 20px; }
    .field { display: flex; flex-direction: column; gap: 6px;
        label { font-size: 13px; font-weight: 700; color: ${({ theme }) => theme.colorSubtitle}; }
        input { padding: 12px; border: 2px solid ${({ theme }) => theme.color2}; border-radius: 12px; background: ${({ theme }) => theme.bg}; color: ${({ theme }) => theme.text}; font-size: 15px; &:focus { outline: none; border-color: #1cb0f6; } }
    }
    .save { background: #1cb0f6; color: #fff; border: none; padding: 14px 28px; border-radius: 14px; font-weight: 700; font-size: 15px; cursor: pointer; width: 100%; &:disabled { background: #ccc; } }
    .exito { color: #53B257; font-weight: 700; margin-bottom: 12px; }
`;
