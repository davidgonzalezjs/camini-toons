import {useState} from 'react';
import styled from 'styled-components';
import { SketchPicker } from 'react-color';

export const Label = styled.label`
    
`;

export const Input = styled.input`
    width: 90px;
`;

export const ColorInput = styled(Input)`
    padding: 0;
    margin: 3px;
    border: none;
`;

const CoverArea = styled.div`
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
`;

export const ColorPicker = ({color, onChange}) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
  
    const handleOpenPicker = () => {
      setShowColorPicker(true);
    };

    const handleClosePicker = () => {
        setShowColorPicker(false);
    };

    const handleChange = color => {
        onChange(color.hex);
    }
    
    return (
      <div>
        <div style={{position: 'absolute', display: showColorPicker ? 'block' : 'none', top: '30%', right: '50%' }}>
          <CoverArea onClick={handleClosePicker} />
          <SketchPicker color={color} onChange={handleChange} />
        </div>
        <div style={{padding: '20px', backgroundColor: color}} onClick={handleOpenPicker}></div>
      </div>
    );
  }
  