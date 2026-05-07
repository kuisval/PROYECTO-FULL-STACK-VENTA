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
        <Container>
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
  grid-template-columns: 1fr;
  background-color: black;
  .contentSideBar {
    display: none;
    background-color: rgba(78, 45, 78, 0.5);
  }
  .contentMenuambur {
    position: absolute;
    background-color: rgba(53, 219, 11, 0.5);
  }
  .contentRouters {
    background-color: rgba(231, 13, 136, 0.5);
    grid-column: 1;
    width: 100%;
  }
  //toda la parte de arriba ya controla mobile, por eso no lo pondremos abajo
  @media ${Device.tablet} {
    grid-template-columns: 88px 1fr;
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
