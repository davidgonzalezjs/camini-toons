import { useState, useEffect } from 'react';


export function useCaminiToons(canvasRef, createCaminiToons) {
  const [caminiToons, setCaminiToons] = useState(null);
  const [toolsNames, setToolsNames] = useState([]);
  const [selectedToolName, setSelectedToolName] = useState('pen');
  const [layersDetails, setLayersDetails] = useState([]);
  const [frameRate, setFrameRate] = useState(6);
  const [currentFrameNumber, setCurrentFrameNumber] = useState(1);
  const [isPlayingOnALoop, setIsPlayingOnALoop] = useState(false);

  useEffect(() => {
    const newCaminiToons = createCaminiToons(canvasRef.current);

    newCaminiToons.registerListener({
      handleToolChanged() {
        setSelectedToolName(newCaminiToons.selectedTool.name);
      },
      handleFrameChanged() {
        setCurrentFrameNumber(newCaminiToons.currentFrameNumber)
      },
      handleFrameCreated() {
        setLayersDetails(newCaminiToons.layersDetails);
      },
      handleLayerNameChanged() {
        setLayersDetails(newCaminiToons.layersDetails);
      },
      handleVisibilityClick() {
        setLayersDetails(newCaminiToons.layersDetails)
      },
      handleOnionSkinChanged() {
        setLayersDetails(newCaminiToons.layersDetails)
      },
      handlePlayBackUpdate() {
        setIsPlayingOnALoop(newCaminiToons.isPlayingOnALoop());
      }
    });

    window.caminiToons = newCaminiToons;
    
    setCaminiToons(newCaminiToons);

    setSelectedToolName(newCaminiToons.selectedTool.name);
    setToolsNames(newCaminiToons.toolsNames);
    setFrameRate(newCaminiToons.frameRate);
    setCurrentFrameNumber(newCaminiToons.currentFrameNumber);
    setLayersDetails(newCaminiToons.layersDetails);
    setIsPlayingOnALoop(newCaminiToons.isPlayingOnALoop())
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
    if (caminiToons.isPlayingOnALoop()) {
      caminiToons.deactivatePlayOnALoop();
    }
    else {
      caminiToons.activatePlayOnALoop();
    }
  };

  const handleVisibilityClick = () => {
    // TODO: se rompe el encapsulamiento
    const layer = caminiToons._animationDocument.activeLayer; 
    
    if (layer.isVisible()) {
      caminiToons.hideLayer(0);
    }
    else {
      caminiToons.showLayer(0);
    }
  }

  const handleOnionSkinClick = () => {
    // TODO: se rompe el encapsulamiento
    const layer = caminiToons._animationDocument.activeLayer; 
    if (layer.hasOnionSkinEnabled()) {
      caminiToons.deactivateOnionSkin();
    }
    else {
      caminiToons.activateOnionSkin();
    }
  };
  
  const handleFrameRateChange = (anEvent) => {
    const newFrameRate = parseInt(anEvent.target.value);
    
    if (!isNaN(newFrameRate) && newFrameRate > 0) {
      caminiToons.changeFrameRateTo(newFrameRate);
      setFrameRate(newFrameRate);
    }
  };

  const handleLayerNameChanged = (layerIndex, newName) => {
    caminiToons.changeNameOfLayer(layerIndex, newName);
  };

  return {
    toolsNames,
    selectedToolName,
    frameRate,
    currentFrameNumber,
    layersDetails,
    isPlayingOnALoop,

    handleToolIconClicked,
    handleCreateFrame,
    handleFrameClick,
    handlePlayAnimation,
    handleRepeatAnimation,
    handleVisibilityClick,
    handleOnionSkinClick,
    handleFrameRateChange,
    handleLayerNameChanged
  }
}