import styled from 'styled-components'

import Column from '../Column';

import pencilIcon from '../../assets/pencil.svg'
import pointerIcon from '../../assets/pointer.svg'

import ToolBoxIcon from './ToolBoxIcon';

const StyledToolBoxBar = styled(Column)`
  background-color: lightblue;
`;

const toolsIcons = {
  pen: pencilIcon,
  selectionTool: pointerIcon
}

export const ToolBoxBar = ({ selectedToolName, toolsNames, onToolIconClicked}) => {  
  return (
    <StyledToolBoxBar>
      {toolsNames.map(toolName =>
        <ToolBoxIcon
          key={toolName}
          src={toolsIcons[toolName]}
          selected={toolName === selectedToolName}
          onClick={() => onToolIconClicked(toolName)}
        />
      )}
    </StyledToolBoxBar>
  );
}