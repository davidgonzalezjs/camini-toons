import {useState} from 'react';

import {InputContainer, InputGroup, InputCell, Label, Input} from '../input/Input';


export const InsertAnimationClipBar = ({onAccept, animationClipsDetails, layersDetails}) => {
    const [animationClipName, setAnimationClipName] = useState('');
    const [layerIndex, setLayerIndex] = useState(0); 
    const [position, setPosition] = useState(1);
  
    const handleAnimationClipNameChange = event => {
        setAnimationClipName(event.target.value)
    };
    const handleLayerChange = event => setLayerIndex(parseInt(event.target.value));
    const handleChangePosition = event => setPosition(parseInt(event.target.value));
    
    const handleInsert = () => {
      console.log('handleInsert: ' + animationClipName)
        
      onAccept('asd', layerIndex, position)
    };
    
    return (
        <div>
            <h2>Insertar</h2>
            <InputContainer withBorders>
                <InputGroup>
                    <InputCell>
                        <label>Clip</label>
                    </InputCell>
                    <InputCell>
                        <select value={animationClipName} onChange={handleAnimationClipNameChange}>
                            {animationClipsDetails.map(clip =>
                                <option value={clip.name}>{clip.name}</option>)}
                        </select>
                    </InputCell>
                </InputGroup>

                <InputGroup>
                    <InputCell>
                        <label>Capa</label>
                    </InputCell>

                    <InputCell>
                        <select value={layerIndex} onChange={handleLayerChange}>
                            {layersDetails.map((layerDetails, index) =>
                                <option value={index}>{layerDetails.name}</option>)}
                        </select>
                    </InputCell>    
                </InputGroup>

                <InputGroup>
                    <InputCell>
                        <label>Cuadro</label>
                    </InputCell>

                    <InputCell>
                        <input type="number" value={position} onChange={handleChangePosition}/>    
                    </InputCell>
                </InputGroup>
                
                <button onClick={handleInsert}>Insertar</button>
            </InputContainer>
        </div>
    );
  }
  