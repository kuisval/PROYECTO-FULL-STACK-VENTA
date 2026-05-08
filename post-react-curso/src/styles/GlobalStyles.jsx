import {createGlobalStyle} from "styled-components"
export const GlobalStyle = createGlobalStyle`

    body {
        margin: 0;
        padding: 0;
        box-sizing:border-box;
        background-color:${(props) =>props.theme.bgtotal}; //pongo "theme" por que en el elemento de themeprovider tambien se utiliza
        font-family: "Poppins", sans-serif;
        color: #fff;
    }

`;
    
