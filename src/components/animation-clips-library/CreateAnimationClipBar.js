import {useState} from 'react';

import {InputContainer, InputGroup, InputCell, Label} from '../input/Input';


export const CreateAnimationClipBar = ({onAccept, layersDetails}) => {
    const [clipName, setClipName] = useState('');
    const [layerIndex, setLayerIndex] = useState(0); 
    const [startFrameNumber, setStartFrameNumber] = useState(1); 
    const [endFrameNumber, setEndFrameNumber] = useState(1);

    const handleClipNameChange = event => setClipName(event.target.value);
    const handleLayerChange = event => setLayerIndex(parseInt(event.target.value));
    const handleStartFrameNumberChange = event => setStartFrameNumber(parseInt(event.target.value));
    const handleEndFrameNumberChange = event => setEndFrameNumber(parseInt(event.target.value));
    
    const handleCreate = () => {
      onAccept(clipName, layerIndex, startFrameNumber, endFrameNumber)
    };
    
    return (
        <div>
            <h2>Crear</h2>
            <InputContainer withBorders>
                <InputGroup>
                    <InputCell>
                        <Label>Nombre</Label>
                    </InputCell>

                    <input type="text" value={clipName} onChange={handleClipNameChange} />
                </InputGroup>

                <InputGroup>
                    <InputCell>
                        <Label>Capa</Label>
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
                        <Label>Cuadro inicial</Label>
                    </InputCell>

                    <InputCell>
                        <input type="number" value={startFrameNumber} onChange={handleStartFrameNumberChange}/>    
                    </InputCell>
                </InputGroup>
                
                <InputGroup>
                    <InputCell>
                        <Label>Ultimo cuadro</Label>
                    </InputCell>

                    <InputCell>
                        <input type="number" value={endFrameNumber} onChange={handleEndFrameNumberChange}/>
                    </InputCell>
                </InputGroup>

                <button onClick={handleCreate}>Crear</button>
            </InputContainer>
        </div>
    );
  }
  