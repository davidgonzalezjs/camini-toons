import styled, {css} from 'styled-components';

import {ModalArea} from '../modal/ModalArea';
import {useModalState} from '../modal/useModalState';
import { SketchPicker } from 'react-color';

export const InputContainer = styled.table`
  ${props => props.withBorders && css`
    border: 1px solid grey;
    padding: 1em;
    border-radius: 5px;
  `}
`;

export const InputGroup = styled.tr``;

export const InputCell = styled.td`
  padding: 5px;
`;

export const Label = styled.label`    
`;

export const Input = styled.input`
    width: 90px;
`;

export const ColorPicker = ({color, onChange}) => {
    const [showColorPicker, openColorPicker, closeColorPicker] = useModalState();

    const handleChange = color => {
        onChange(color.hex);
    }
    
    return (
      <div>
        <ModalArea show={showColorPicker} onClickOutside={closeColorPicker}>
          <SketchPicker color={color} onChange={handleChange} />
        </ModalArea>

        <div style={{padding: '20px', backgroundColor: color, borderRadius: '100%', width: '8px', height: '8px'}} onClick={openColorPicker}></div>
      </div>
    );
  }
  