import styled from 'styled-components';
import { Btnsave, Footer, InputText2, Linea, Title } from '../../index'
import { v } from '../../styles/variables'
import {Device} from '../../styles/breakpoints'
export function LoginTemplate() {
    return (
    <Container>

            <div className='card'>
                <Title $paddingbottom="50px" >Ingresar</Title>
                <form>
                    <InputText2>
                    <input className='form__field' placeholder='Email' type='text'>
                    </input>
                    </InputText2> {/* como pide hijos, se pone de esta forma */}

                    <InputText2>
                    <input className='form__field' placeholder='Contraseña' type='password'>
                    </input>
                    
                    </InputText2> {/* como pide hijos, se pone de esta forma */}
                    <Btnsave titulo="INICIAR SESIÓN" bgcolor="#1cb0f6" color="255, 255, 255" width="100%" />                </form>
                <Linea >
                    <span></span>
                </Linea>
                <Btnsave titulo = "Google" bgcolor="#fff" icono={<v.iconogoogle/>}/>

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
        background-color: ${({ theme }) => theme.bg}; // Fondo de la tarjeta (blanco o gris oscuro)
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); // Elevación
        display: flex;
        flex-direction: column;
        width: 90%;
        max-width: 450px;
        
        form {
            display: flex;
            flex-direction: column;
            gap: 15px; // Espacio uniforme entre inputs
            
            .actions {
                margin-top: 10px;
            }
        }

        @media ${Device.tablet} {
            padding: 50px;
        }
    }
`;