import {ModalArea} from '../modal/ModalArea';
import {useModalState} from '../modal/useModalState';
import styled from 'styled-components';
import { SketchPicker } from 'react-color';

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

        <div style={{padding: '20px', backgroundColor: color}} onClick={openColorPicker}></div>
      </div>
    );
  }
  