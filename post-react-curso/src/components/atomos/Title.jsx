import styled from 'styled-components';
export const Title = styled.h1` 
    font-weight: 900;
    font-size: 35px;
    display: block; 
    text-align: center;
    margin: 0; 
    padding-bottom: ${(props) => props.$paddingbottom || "20px"};
    color: ${({ theme }) => theme.text};
`;