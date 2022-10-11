import styled from 'styled-components'

import Column from './Column';

export const Card = styled(Column)`
    border-radius: 5px;
    margin: 5px;

    flex-direction: ${props => props.row ? 'row' : 'column'};
`;


export const CardRow = styled(Card)`
    border-radius: 5px;
    margin: 5px;

    flex-direction: 'row';
`;