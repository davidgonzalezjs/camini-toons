import { useState, useEffect } from 'react';


export function useCaminiToons(canvasRef, createCaminiToons) {
  const [caminiToons, setCaminiToons] = useState(null);
  const [toolsNames, setToolsNames] = useState([]);
  const [selectedToolName, setSelectedToolName] = useState('pen');
  const [frames, setFrames] = useState([{number: 1}]);
  const [frameRate, setFrameRate] = useState(6);
  const [currentFrameNumber, setCurrentFrameNumber] = useState(1);

  useEffect(() => {
    const newCaminiToons = createCaminiToons(canvasRef.current);

    newCaminiToons.registerListener({
      handleFrameChanged() {
        setCurrentFrameNumber(newCaminiToons.currentFrameNumber)
      },
      handleToolChanged() {
        setSelectedToolName(newCaminiToons.selectedTool.name);
      },
      handleFrameCreated() {
        setFrames(newCaminiToons.framesDetails);
      }
    });

    window.caminiToons = newCaminiToons;
    
    setCaminiToons(newCaminiToons);

    setSelectedToolName(newCaminiToons.selectedTool.name);
    setToolsNames(newCaminiToons.toolsNames);
    setFrameRate(newCaminiToons.frameRate);
    setCurrentFrameNumber(newCaminiToons.currentFrameNumber);
  }, [createCaminiToons]);

  const handleToolIconClicked = aToolName => {
    caminiToons.useToolNamed(aToolName);
  };

  const handleCreateFrame = (layerName) => {
    caminiToons.createFrame();
  };

  const handleFrameClick = frame => {
    caminiToons.goToFrame(frame.number);
  };

  const handlePlayAnimation = () => {
    caminiToons.playAnimation();
  };

  const handleRepeatAnimation = () => {

  };

  const handleOnionSkinClick = () => {
    // TODO: se rompe el encapsulamiento
    const layer = caminiToons._animationDocument.activeLayer; 
    if (layer.hasOnionSkinEnabled()) {
      layer.deactivateOnionSkin();
    }
    else {
      layer.activateOnionSkin();
    }
  };
  
  const handleFrameRateChange = (anEvent) => {
    const newFrameRate = parseInt(anEvent.target.value);
    
    if (!isNaN(newFrameRate) && newFrameRate > 0) {
      caminiToons.changeFrameRateTo(newFrameRate);
      setFrameRate(newFrameRate);
    }
  };

  return {
    toolsNames,
    selectedToolName,
    frames,
    frameRate,
    currentFrameNumber,

    handleToolIconClicked,
    handleCreateFrame,
    handleFrameClick,
    handlePlayAnimation,
    handleRepeatAnimation,
    handleOnionSkinClick,
    handleFrameRateChange
  }
}