import styled, {css} from 'styled-components'

const ToolBoxIcon = styled.img`
  width: 40px;
  height: 40px;
  padding: 0.6em;
  margin: 0.3em;
  border-radius: 5px;

  ${props => props.selected && css`
    background-color: azure;
  `}
`;

export default ToolBoxIcon;