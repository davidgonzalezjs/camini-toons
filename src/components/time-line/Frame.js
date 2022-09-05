import styled from 'styled-components'

const Frame = styled.div`
  background-color: greenyellow;
  border: 2px solid darkgreen;
  width: 15px;
    
  &::before {
    content: '*';
  }
`;

export default Frame;