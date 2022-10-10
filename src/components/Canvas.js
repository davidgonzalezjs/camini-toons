import styled, {css} from 'styled-components'

//import pencilIcon from '../assets/pencil.svg'

const Canvas = styled.canvas`
  border: 1px solid grey;
  background-color: white;
   
  ${({selectedToolName}) => (selectedToolName === 'pen' || selectedToolName === 'eraser') && css`    
    &:hover {
      cursor: none;
    }
  `}
`;

export default Canvas;