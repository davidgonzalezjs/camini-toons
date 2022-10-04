import {useState} from 'react';

export const InsertAnimationClipBar = ({onAccept, animationClipsDetails, layersDetails}) => {
    const [animationClipName, setAnimationClipName] = useState('');
    const [layerIndex, setLayerIndex] = useState(0); 
    const [position, setPosition] = useState(1);
  
    const handleAnimationClipNameChange = event => setAnimationClipName(parseInt(event.target.value));
    const handleLayerChange = event => setLayerIndex(parseInt(event.target.value));
    const handleChangePosition = event => setPosition(parseInt(event.target.value));
    
    const handleInsert = () => {
      onAccept(layerIndex, position, )
    };
    
    return (
        <div style={{backgroundColor: 'grey', padding: '10px'}}>
            <select value={layerIndex} onChange={handleLayerChange}>
                {layersDetails.map((layerDetails, index) =>
                    <option value={index}>{layerDetails.name}</option>)}
            </select>
            
            <label>Clip</label>
            <select value={animationClipName} onChange={handleAnimationClipNameChange}>
                {animationClipsDetails.map((clip, index) =>
                    <option value={index}>{clip.name}</option>)}
            </select>

            <label>Posicion</label>
            <input type="number" value={position} onChange={handleChangePosition}/>
            
            <button onClick={handleInsert}>Insertar</button>
        </div>
    );
  }
  