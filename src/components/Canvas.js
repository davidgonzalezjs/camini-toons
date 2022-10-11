import styled, {css} from 'styled-components'

const Canvas = styled.canvas`
  border: 1px solid grey;
  background-color: white;

  margin-top: 5px;
  margin-bottom: 5px;
     
  ${({selectedToolName}) => (selectedToolName === 'pen' || selectedToolName === 'eraser') && css`    
    &:hover {
      cursor: none;
    }
  `}
`;

export default Canvas;