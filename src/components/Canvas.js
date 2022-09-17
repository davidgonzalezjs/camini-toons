import styled, {css} from 'styled-components'

//import pencilIcon from '../assets/pencil.svg'

const Canvas = styled.canvas`
  border: 1px solid grey;
  background-color: white;
   
  ${({selectedToolName}) => selectedToolName === 'pen' && css`    
    &:hover {
      cursor: crosshair;
    }
  `}
`;

export default Canvas;