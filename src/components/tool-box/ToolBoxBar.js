import styled from 'styled-components'

import {Card} from '../Card';

import pencilIcon from '../../assets/pencil.svg'
import eraserIcon from '../../assets/eraser.svg'
import pointerIcon from '../../assets/pointer.svg'
import handIcon from '../../assets/hand.svg'
import paintBucketIcon from '../../assets/paintBucket.svg'

import ToolBoxIcon from './ToolBoxIcon';

const StyledToolBoxBar = styled(Card)`
  background-color: lightblue;
`;

const toolsIcons = {
  pen: pencilIcon,
  eraser: eraserIcon,
  selectionTool: pointerIcon,
  hand: handIcon,
  paintBucket: paintBucketIcon 
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