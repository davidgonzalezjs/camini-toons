import { useState, useEffect } from 'react';


export function useCaminiToons(canvasRef, createCaminiToons) {
  const [caminiToons, setCaminiToons] = useState(null);
  const [toolsNames, setToolsNames] = useState([]);
  const [selectedToolName, setSelectedToolName] = useState('pen');
  const [layersDetails, setLayersDetails] = useState([]);
  const [animationClipsDetails, setAnimationClipsDetails] = useState([]);
  const [frameRate, setFrameRate] = useState(6);
  const [currentFrameNumber, setCurrentFrameNumber] = useState(1);
  const [lastFrameNumber, setLastFrameNumber] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingOnALoop, setIsPlayingOnALoop] = useState(false);
  const [penStyle, setPenStyle] = useState({});
  const [eraserStyle, setEraserStyle] = useState({});
  const [onionSkinSettings, setOnionSkinSettings] = useState({ beforeColor: "red", afterColor: "green", numberOfFramesBefore: 3, numberOfFramesAfter: 3, opacityStep: 0.22 });

  useEffect(() => {
    const newCaminiToons = createCaminiToons(canvasRef.current);

    newCaminiToons.registerListener({
      handleToolChanged() {
        setSelectedToolName(newCaminiToons.selectedTool.name);
        setPenStyle(newCaminiToons.penStyle);
        setEraserStyle(newCaminiToons.eraserStyle);
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
        setOnionSkinSettings(newCaminiToons.onionSkinSettings);
      },
      handleLayerUpdate() {
        setLayersDetails(newCaminiToons.layersDetails);
        setLastFrameNumber(newCaminiToons.lastFrameNumber);
        setAnimationClipsDetails(newCaminiToons.animationClipsDetails);
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
    setIsPlayingOnALoop(newCaminiToons.isPlayingOnALoop());
    setPenStyle(newCaminiToons.penStyle);
    setOnionSkinSettings(newCaminiToons.onionSkinSettings);
  }, [createCaminiToons, canvasRef]);

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

  const handlePenStyleChanged = (newStyle) => {
    caminiToons.changePenStyle(newStyle);
  };

  const handleEraserStyleChanged = (newStyle) => {
    caminiToons.changeEraserStyle(newStyle);
  };

  const handleConvertFrameToKeyFrame = ({layerIndex, frameNumber}) => {
    caminiToons.convertToKeyFrame({layerIndex, frameNumber});
  };

  const handleExtendFrameClick = ({layerIndex, frameNumber}) => {
    caminiToons.extendFrameOnLayer({layerIndex, frameNumber});
  };

  const handleCreateBefore = ({layerIndex, frameNumber}) => {
    console.log(`layerIndex: ${layerIndex} | frameNumber: ${frameNumber}}]`);
    caminiToons.createFrameBefore({layerIndex, frameNumber});
  };

  const handleDeleteFrameClick = ({layerIndex, frameNumber}) => {
    caminiToons.deleteFrame({layerIndex, frameNumber});
  };

  const handleExtractToAnimationClipClick = (clipName, layerIndex, startFrameNumber, endFrameNumber) => {
    caminiToons.extractToAnimationClip({name: clipName, layerIndex, startFrameNumber, endFrameNumber});
  };

  const handleInsertAnimationClick = (name, layerIndex, startFrameNumber) => {
    caminiToons.insertAnimationClip({name, layerIndex, startFrameNumber});
  };

  const handleOnionSkinSettingsChange = (newOnionSkinSettings) => {
    caminiToons.changeOnionSkinSettings(newOnionSkinSettings);
  };
  

  return {
    toolsNames,
    selectedToolName,
    frameRate,
    currentFrameNumber,
    lastFrameNumber,
    layersDetails,
    animationClipsDetails,
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
    handleCreateLayerClick,
    
    penStyle,
    handlePenStyleChanged,

    eraserStyle,
    handleEraserStyleChanged,

    handleConvertFrameToKeyFrame,
    handleExtendFrameClick,
    handleCreateBefore,
    handleDeleteFrameClick,
    handleExtractToAnimationClipClick,
    handleInsertAnimationClick,

    onionSkinSettings,
    handleOnionSkinSettingsChange
  }
}