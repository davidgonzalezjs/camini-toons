import {useState} from 'react';

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
        <div style={{backgroundColor: 'grey', padding: '10px'}}>
            <input type="text" value={clipName} onChange={handleClipNameChange} />
            <select value={layerIndex} onChange={handleLayerChange}>
            {layersDetails.map((layerDetails, index) =>
                <option value={index}>{layerDetails.name}</option>)}
            </select>
            <label>Desde</label>
            <input type="number" value={startFrameNumber} onChange={handleStartFrameNumberChange}/>
            <label>Hasta</label>
            <input type="number" value={endFrameNumber} onChange={handleEndFrameNumberChange}/>
            <button onClick={handleCreate}>Crear</button>
        </div>
    );
  }
  