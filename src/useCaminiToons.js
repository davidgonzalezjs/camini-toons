import { useState, useEffect } from 'react';


export function useCaminiToons(canvasRef, createCaminiToons) {
  const [caminiToons, setCaminiToons] = useState(null);
  const [toolsNames, setToolsNames] = useState([]);
  const [selectedToolName, setSelectedToolName] = useState('pen');
  const [layersDetails, setLayersDetails] = useState([]);
  const [frameRate, setFrameRate] = useState(6);
  const [currentFrameNumber, setCurrentFrameNumber] = useState(1);
  const [lastFrameNumber, setLastFrameNumber] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
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
      handleLayerNameChanged() {
        setLayersDetails(newCaminiToons.layersDetails);
      },
      handleVisibilityClick() {
        setLayersDetails(newCaminiToons.layersDetails);
      },
      handleOnionSkinChanged() {
        setLayersDetails(newCaminiToons.layersDetails);
      },
      handleLayerUpdate() {
        setLayersDetails(newCaminiToons.layersDetails);
        setLastFrameNumber(newCaminiToons.lastFrameNumber);
      },
      handlePlayBackUpdate() {
        setIsPlaying(newCaminiToons.isPlaying());
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

  const handleCreateFrame = (layerIndex) => {
    caminiToons.createFrameOnLayer(layerIndex);
  };

  const handleFrameClick = ({layerIndex, frameNumber}) => {
    caminiToons.goToFrame(frameNumber);
  };

  const handlePlayAnimation = () => {
    caminiToons.playAnimation();
  };

  const handleStopAnimation = () => {
    caminiToons.stopAnimation();
  };

  const handleRepeatAnimation = () => {
    if (caminiToons.isPlayingOnALoop()) {
      caminiToons.deactivatePlayOnALoop();
    }
    else {
      caminiToons.activatePlayOnALoop();
    }
  };

  const handleVisibilityClick = (layerIndex) => {
    if (caminiToons.isVisibleLayer(layerIndex)) {
      caminiToons.hideLayer(layerIndex);
    }
    else {
      caminiToons.showLayer(layerIndex);
    }
  }

  const handleOnionSkinClick = (layerIndex) => {
    if (caminiToons.hasOnionSkinEnabledOnLayer(layerIndex)) {
      caminiToons.deactivateOnionSkinOnLayer(layerIndex);
    }
    else {
      caminiToons.activateOnionSkinOnLayer(layerIndex);
    }
  };
  
  const handleFrameRateChange = (anEvent) => {
    const newFrameRate = parseInt(anEvent.target.value);
    
    if (!isNaN(newFrameRate) && newFrameRate > 0) {
      caminiToons.changeFrameRateTo(newFrameRate);
      setFrameRate(newFrameRate);
    }
  };

  const handleLayerClick = (layerIndex) => {
    caminiToons.activateLayer(layerIndex);
  }

  const handleLayerNameChanged = (layerIndex, newName) => {
    caminiToons.changeNameOfLayer(layerIndex, newName);
  };

  const handleCreateLayerClick = () => {
    caminiToons.createAnimationLayer();
  };
  

  return {
    toolsNames,
    selectedToolName,
    frameRate,
    currentFrameNumber,
    lastFrameNumber,
    layersDetails,
    isPlaying,
    isPlayingOnALoop,

    handleToolIconClicked,
    handleCreateFrame,
    handleFrameClick,
    handlePlayAnimation,
    handleStopAnimation,
    handleRepeatAnimation,
    handleVisibilityClick,
    handleOnionSkinClick,
    handleLayerClick,
    handleFrameRateChange,
    handleLayerNameChanged,
    handleCreateLayerClick
  }
}