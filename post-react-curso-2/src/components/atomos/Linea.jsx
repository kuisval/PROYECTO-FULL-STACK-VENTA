import styled from 'styled-components';

export const Linea = styled.div`
    background-color: ${({ theme }) => theme.color2};
    height: 1px; 
    width: 100%;
    margin: 30px 0;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
        position: absolute;
        background-color: ${(props) => props.theme.bgtotal};
        padding: 0 15px;
        color: ${({ theme }) => theme.color2};
        font-weight: 700;
        font-size: 14px;
        text-transform: uppercase;
    }
`;