import styled from 'styled-components';
import { Btnsave, InputText2, Title } from '../../index'
export function LoginTemplate() {
    return (
    <Container>
        <section className='contentCard'>
            <div className='card'>
                <Title>Ingresar</Title>
                <form>
                    <InputText2>
                    <input className='form__field' placeholder='Email' type='text'>
                    </input>
                    </InputText2> {/* como pide hijos, se pone de esta forma */}

                    <InputText2>
                    <input className='form__field' placeholder='Contraseña' type='password'>
                    </input>
                    <Btnsave titulo="ACCEDER" bgcolor="#c4c4c4" color="0, 0, 0" width="100%"/>
                    </InputText2> {/* como pide hijos, se pone de esta forma */}
                </form>

            </div>
        </section>

    </Container>
    );
}

const Container = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

`;