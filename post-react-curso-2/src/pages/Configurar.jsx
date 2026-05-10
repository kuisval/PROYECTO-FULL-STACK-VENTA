import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { DataModulosConfiguracion } from "../utils/dataEstatica";

export function Configurar() {
    const navigate = useNavigate();

    return (
        <Container>
            <h2>Configuración</h2>
            <p className="sub">Administra los módulos del sistema</p>
            <div className="grid">
                {DataModulosConfiguracion.map(({ title, subtitle, icono, link }) => (
                    <div className="card" key={title} onClick={() => navigate(link)}>
                        <img src={icono} alt={title} />
                        <h3>{title}</h3>
                        <p>{subtitle}</p>
                    </div>
                ))}
            </div>
        </Container>
    );
}

const Container = styled.div`
    padding: 24px;
    min-height: 100vh;
    padding-bottom: 80px;
    h2 { margin: 0; font-size: 22px; font-weight: 800; }
    .sub { color: ${({ theme }) => theme.colorSubtitle}; margin: 4px 0 24px; }
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
    }
    .card {
        background: ${({ theme }) => theme.bg};
        border: 2px solid ${({ theme }) => theme.color2};
        border-radius: 20px;
        padding: 28px 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
            border-color: #1cb0f6;
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        img { width: 56px; height: 56px; object-fit: contain; margin-bottom: 12px; }
        h3 { margin: 0 0 6px; font-size: 16px; font-weight: 700; }
        p { margin: 0; font-size: 13px; color: ${({ theme }) => theme.colorSubtitle}; }
    }
`;
