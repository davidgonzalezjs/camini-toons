import {useEffect, useState} from 'react';
import styled, {css} from 'styled-components';

import {InputContainer, InputGroup, InputCell, Label, Input} from '../input/Input';

export const InsertAnimationClipBar = ({onAccept, animationClipsDetails, layersDetails}) => {
    const [animationClipName, setAnimationClipName] = useState('aaaqqqq');
    const [layerIndex, setLayerIndex] = useState(0); 
    const [position, setPosition] = useState(1);
  
    useEffect(() => {
        if (animationClipsDetails.length === 1) {
            setAnimationClipName(animationClipsDetails[0].name)
        }
    }, [animationClipsDetails]);

    const handleSelectAnimationClipNameChanged = event => setAnimationClipName(event.target.value);
    const handleLayerChange = event => setLayerIndex(parseInt(event.target.value));
    const handleChangePosition = event => setPosition(parseInt(event.target.value));
    
    const handleInsert = () => onAccept(animationClipName, layerIndex, position);
    
    return (
        <div>
            <h2>Insertar</h2>
            
            <InputContainer withBorders>
                <InputGroup>
                    <InputCell>
                        <Label>Clip</Label>
                    </InputCell>

                    <InputCell>
                        <select
                            value={animationClipName}
                            onChange={handleSelectAnimationClipNameChanged}
                            size="8"
                            style={{width: '100%'}}
                    >
                            {animationClipsDetails.map(clip =>
                                <option value={clip.name}
                                    onClick={() => handleSelectAnimationClipNameChanged(clip.name)}
                                    isSelected={animationClipName === clip.name}
                                >
                                        {clip.name}
                                </option>)}
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
  