import {useState} from 'react';

export const InsertAnimationClipBar = ({onAccept, animationClipsDetails, layersDetails}) => {
    const [animationClipName, setAnimationClipName] = useState('');
    const [layerIndex, setLayerIndex] = useState(0); 
    const [position, setPosition] = useState(1);
  
    const handleAnimationClipNameChange = event => {
        console.log('handleAnimationClipNameChange: ' + event.taget.value)
        setAnimationClipName(event.target.value)
    };
    const handleLayerChange = event => setLayerIndex(parseInt(event.target.value));
    const handleChangePosition = event => setPosition(parseInt(event.target.value));
    
    const handleInsert = () => {
      console.log('handleInsert: ' + animationClipName)
        
      onAccept('asd', layerIndex, position)
    };
    
    return (
        <div style={{backgroundColor: 'grey', padding: '10px'}}>
            <div>
                <label>Clip</label>
                <select value={animationClipName} onChange={handleAnimationClipNameChange}>
                    {animationClipsDetails.map(clip =>
                        <option value={clip.name}>{clip.name}</option>)}
                </select>
            </div>

            <div>
                <label>Capa</label>
                <select value={layerIndex} onChange={handleLayerChange}>
                    {layersDetails.map((layerDetails, index) =>
                        <option value={index}>{layerDetails.name}</option>)}
                </select>    
            </div>

            <div>
                <label>Posicion</label>
                <input type="number" value={position} onChange={handleChangePosition}/>    
            </div>
            
            <button onClick={handleInsert}>Insertar</button>
        </div>
    );
  }
  