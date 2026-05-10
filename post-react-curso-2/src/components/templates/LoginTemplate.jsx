import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Btnsave, Footer, InputText2, Linea, Title, useAuthStore } from '../../index'
import { v } from '../../styles/variables'
import { Device } from '../../styles/breakpoints'

export function LoginTemplate() {
    const { loginGoogle, loginEmail } = useAuthStore()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e?.preventDefault()
        if (!email || !password) { setError('Completa todos los campos'); return }
        setLoading(true)
        setError('')
        try {
            await loginEmail(email, password)
            navigate('/')
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container>
            <div className='card'>
                <Title $paddingbottom="50px">Ingresar</Title>
                <form onSubmit={handleLogin}>
                    <InputText2>
                        <input
                            className='form__field'
                            placeholder='Email'
                            type='email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </InputText2>
                    <InputText2>
                        <input
                            className='form__field'
                            placeholder='Contraseña'
                            type='password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </InputText2>
                    {error && <p className='error'>{error}</p>}
                    <Btnsave
                        funcion={handleLogin}
                        titulo={loading ? 'Cargando...' : 'INICIAR SESIÓN'}
                        bgcolor="#1cb0f6"
                        color="255, 255, 255"
                        width="100%"
                        disabled={loading}
                    />
                </form>
                <Linea><span></span></Linea>
                <Btnsave funcion={loginGoogle} titulo="Continuar con Google" bgcolor="#fff" icono={<v.iconogoogle />} />
            </div>
            <Footer />
        </Container>
    );
}

const Container = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.bgtotal};
    flex-direction: column;
    .card {
        background-color: ${({ theme }) => theme.bg};
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        width: 70%;
        max-width: 450px;
        border: 1px solid ${({ theme }) => theme.color2};
        form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .error {
            color: ${() => v.colorError};
            font-size: 14px;
            text-align: center;
            margin: 0;
        }
        @media ${Device.tablet} { padding: 50px; }
    }
`;
