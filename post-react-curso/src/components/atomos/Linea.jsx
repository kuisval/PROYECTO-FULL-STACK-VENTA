import styled from 'styled-components';

export const Linea = styled.div `
    background-color: ${({ theme }) => theme.color2};
    height: 2px;
    border-radius: 15px;
    margin: 20px 0;
    position: relative;
    text-align: center;
    span {
        top: -15px;
        position: absolute;
        background-color: #fff;
        text-align: center;
        padding: 0 5px;
        color: ${({ theme }) => theme.color2};
        font-weight: 700;
    }
`