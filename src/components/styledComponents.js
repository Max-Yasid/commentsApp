import styled, { css } from 'styled-components';

export const CommentOption = styled.button`
    color: var(--main-color);
    font-weight: bolder;
    cursor:pointer;
    background-color: transparent;
    border: none;
    transition: opacity .2s linear;
    :hover{
        opacity: .4
    }
    ${
        props => props.danger && css`
            color: var(--danger-color)
        `
    }
`;
export const OptionButton = styled.button`
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    border: none;
    background-color: hsl(211, 10%, 45%);
    ${props => props.danger && css`
        background-color: var(--danger-color);
    `} 
`