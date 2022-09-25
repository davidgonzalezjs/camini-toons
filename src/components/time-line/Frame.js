import styled from 'styled-components'

export const Frame = styled.div`
  border-right: 1px solid darkgreen;
  width: 15px;

  background:
    linear-gradient(
      to right,
      ${props => props.isEmpty ? 'lightgreen' : 'greenyellow'} 40%,
      ${props => props.isCurrentFrame ? 'red' : props.isEmpty ? 'lightgreen' : 'greenyellow'} 40% 60%,
      ${props => props.isEmpty ? 'lightgreen' : 'greenyellow'} 60%
    );
    
  &::before {
    content: '${props => props.isEmpty ? '' : '*'}';
  }
`;
