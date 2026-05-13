import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';


export function PageHeader({ title, back = '/configurar', children }) {
    const navigate = useNavigate();

    return (
        <Container>
            <div className="titulo">
                <button className="back" onClick={() => navigate(back)}>← Volver</button>
                <h2>{title}</h2>
            </div>
            {children && <div className="acciones">{children}</div>}
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .titulo {
        display: flex;
        align-items: center;
        gap: 14px;

        h2 { margin: 0; font-size: 22px; font-weight: 800; }
    }

    .acciones { display: flex; gap: 10px; }

    .back {
        background: none;
        border: 2px solid ${({ theme }) => theme.color2};
        color: ${({ theme }) => theme.text};
        padding: 8px 14px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 700;
        transition: 0.2s;
        &:hover { border-color: #1cb0f6; color: #1cb0f6; }
    }
`;