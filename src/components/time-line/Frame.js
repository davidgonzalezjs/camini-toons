import styled from 'styled-components'

const Frame = styled.div`
  border-right: 1px solid darkgreen;
  width: 15px;

  background:
    linear-gradient(
      to right,
      greenyellow 40%,
      ${props => props.isCurrentFrame ? 'red' : 'greenyellow'} 40% 60%,
      greenyellow 60%
    );
    
  &::before {
    content: '*';
  }
`;

export default Frame;