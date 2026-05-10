import { useState } from 'react'
import { AuthContextProvider, GlobalStyle, MyRouters, Sidebar, useThemeStore } from './index'
import { MobileNavbar } from './components/organismos/MobileNavbar'
import { Device } from './styles/breakpoints'
import styled, { ThemeProvider } from 'styled-components'

function App() {
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const { themeStyle } = useThemeStore();

    return (
        <ThemeProvider theme={themeStyle}>
            <AuthContextProvider>
                <Container className={sidebarOpen ? "active" : ""}>
                    <GlobalStyle />

                    {/* Sidebar — solo en tablet/desktop */}
                    <section className='contentSideBar'>
                        <Sidebar state={sidebarOpen} setState={() => setSideBarOpen(!sidebarOpen)} />
                    </section>

                    {/* Bottom nav — solo en móvil */}
                    <section className='contentMobile'>
                        <MobileNavbar />
                    </section>

                    <section className='contentRouters'>
                        <MyRouters />
                    </section>
                </Container>
            </AuthContextProvider>
        </ThemeProvider>
    )
}

const Container = styled.main`
    display: grid;
    transition: all 0.3s ease;
    grid-template-columns: 1fr;
    background-color: ${({ theme }) => theme.bgtotal};
    color: ${({ theme }) => theme.text};

    /* MÓVIL: sin sidebar, con bottom nav */
    .contentSideBar { display: none; }
    .contentMobile  { display: block; }
    .contentRouters {
        grid-column: 1;
        width: 100%;
        padding-bottom: 72px; /* espacio para la bottom nav */
    }

    /* TABLET / DESKTOP: sidebar visible, sin bottom nav */
    @media ${Device.tablet} {
        grid-template-columns: 88px 1fr;
        &.active { grid-template-columns: 260px 1fr; }

        .contentSideBar { display: initial; }
        .contentMobile  { display: none; }
        .contentRouters {
            grid-column: 2;
            padding-bottom: 0;
        }
    }
`;

export default App