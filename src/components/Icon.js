import styled from 'styled-components';

export const Icon = styled.img`
  opacity: ${props => props.active ?  1 : 0.4 };
  padding: 5px;
`;