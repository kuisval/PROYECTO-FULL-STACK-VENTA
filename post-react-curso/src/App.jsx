import { useState } from 'react'
import { GlobalStyle, MyRouters, Sidebar, useThemeStore } from './index' //como es elemento se importa de esta forma
import { Device } from './styles/breakpoints'
import styled, {ThemeProvider} from 'styled-components'

function App() {
  const [sidebarOpen, setSideBarOpen] = useState(false);
  const {themeStyle} = useThemeStore();
  return (
    <>
    <ThemeProvider theme={themeStyle}>
        <Container className = {sidebarOpen?"active":""}> {/* si esta en true se pone active, si no, nada */}
          <GlobalStyle />
          <section className='contentSideBar'>
            <Sidebar state={sidebarOpen} setState={() => setSideBarOpen(!sidebarOpen)} /></section>
          <section className='contentMenuambur'>menu ambur</section>
          <section className='contentRouters'>
            <MyRouters /></section>
      </Container>
    </ThemeProvider>

    
    </>
  )
}
const Container = styled.main `
  display: grid;
  transition: all 0.3s ease;
  grid-template-columns: 1fr;
  background-color: ${(props) => props.theme.bgtotal}; 
  color:${({theme}) => theme.text};
  .contentSideBar {
    display: none;
  }
  .contentMenuambur {
    position: absolute;

  }
  .contentRouters {

    grid-column: 1;
    width: 100%;
  }
  //toda la parte de arriba ya controla mobile, por eso no lo pondremos abajo
  @media ${Device.tablet} {
    grid-template-columns: 88px 1fr; //Estado CERRADO
    &.active{
      grid-template-columns: 260px 1fr; //Estado ya ABIERTO
    }
    .contentSideBar {
      display: initial;
    }
    .contentMenuambur {
    display: none;
    }
    .contentRouters {
      grid-column: 2;
    }
    
  }
`;
export default App
