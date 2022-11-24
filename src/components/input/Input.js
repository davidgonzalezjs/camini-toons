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

export const Button = styled.button`
  background-color: green;
  border: none;
  border-radius: 3;
  color: white;
  padding: 5px;
  margin: 3px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 15px;

  &:hover {
    background-color: lightgreen;
  }
`;

export const LabelAsButton = styled.label`
  background-color: green;
  border: none;
  border-radius: 3;
  color: white;
  padding: 5px;
  margin: 3px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 15px;

  &:hover {
    background-color: lightgreen;
  }
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

        <div style={{padding: '20px', backgroundColor: color, borderRadius: '100%', border: '1px solid black', width: '8px', height: '8px'}} onClick={openColorPicker}></div>
      </div>
    );
  }
  