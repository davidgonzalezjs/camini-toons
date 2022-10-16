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

    const animationDocumentJSON = window.localStorage.getItem('animationDocument');
    
    if (animationDocumentJSON !== null) {
      const parserAnimationDocumentData = JSON.parse(animationDocumentJSON);
      
      newCaminiToons.deserializeAnimationDocument(parserAnimationDocumentData);
    }

    newCaminiToons.registerListener({
      handleToolChanged() {
        setSelectedToolName(newCaminiToons.selectedTool.name);
        setPenStyle(newCaminiToons.penStyle);
        setEraserStyle(newCaminiToons.eraserStyle);
      },
      handleFrameChanged() {
        setCurrentFrameNumber(newCaminiToons.currentFrameNumber)
      },
      handleChangeLayerName() {
        setLayersDetails(newCaminiToons.layersDetails);
      },
      handleToggleVisibility() {
        setLayersDetails(newCaminiToons.layersDetails);
      },
      handleOnionSkinChanged() {
        setLayersDetails(newCaminiToons.layersDetails);
        setOnionSkinSettings(newCaminiToons.onionSkinSettings);
      },
      handleLayerUpdated() {
        setLayersDetails(newCaminiToons.layersDetails);
        setLastFrameNumber(newCaminiToons.lastFrameNumber);
        setAnimationClipsDetails(newCaminiToons.animationClipsDetails);
      },
      handlePlayBackUpdated() {
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
    setLastFrameNumber(newCaminiToons.lastFrameNumber);
    setLayersDetails(newCaminiToons.layersDetails);
    setIsPlayingOnALoop(newCaminiToons.isPlayingOnALoop());
    setPenStyle(newCaminiToons.penStyle);
    setOnionSkinSettings(newCaminiToons.onionSkinSettings);
  }, [createCaminiToons, canvasRef]);

  const handleChangeTool = aToolName => {
    caminiToons.useToolNamed(aToolName);
  };

  const handleCreateFrame = (layerIndex) => {
    caminiToons.createFrameOnLayer(layerIndex);
  };

  const handleGoToFrame = ({layerIndex, frameNumber}) => {
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

  const handleToggleVisibility = (layerIndex) => {
    if (caminiToons.isVisibleLayer(layerIndex)) {
      caminiToons.hideLayer(layerIndex);
    }
    else {
      caminiToons.showLayer(layerIndex);
    }
  }

  const handleToggleOnionSkin = (layerIndex) => {
    if (caminiToons.hasOnionSkinEnabledOnLayer(layerIndex)) {
      caminiToons.deactivateOnionSkinOnLayer(layerIndex);
    }
    else {
      caminiToons.activateOnionSkinOnLayer(layerIndex);
    }
  };
  
  const handleChangeFrameRate = (newFrameRate) => {
    if (!isNaN(newFrameRate) && newFrameRate > 0) {
      caminiToons.changeFrameRateTo(newFrameRate);
      setFrameRate(newFrameRate);
    }
  };

  const handleActivateLayer = (layerIndex) => {
    caminiToons.activateLayer(layerIndex);
  }

  const handleChangeLayerName = (layerIndex, newName) => {
    caminiToons.changeNameOfLayer(layerIndex, newName);
  };

  const handleCreateLayerClick = () => {
    caminiToons.createAnimationLayer();
  };

  const handleChangePenStyle = (newStyle) => {
    caminiToons.changePenStyle(newStyle);
  };

  const handleChangeEraserStyle = (newStyle) => {
    caminiToons.changeEraserStyle(newStyle);
  };

  const handleConvertToKeyFrame = ({layerIndex, frameNumber}) => {
    caminiToons.convertToKeyFrame({layerIndex, frameNumber});
  };

  const handleExtendFrameOnLayer = ({layerIndex, frameNumber}) => {
    caminiToons.extendFrameOnLayer({layerIndex, frameNumber});
  };

  const handleCreateBefore = ({layerIndex, frameNumber}) => {
    caminiToons.createFrameBefore({layerIndex, frameNumber});
  };

  const handleDeleteFrame = ({layerIndex, frameNumber}) => {
    caminiToons.deleteFrame({layerIndex, frameNumber});
  };

  const handleExtractToAnimationClip = (clipName, layerIndex, startFrameNumber, endFrameNumber) => {
    caminiToons.extractToAnimationClip({name: clipName, layerIndex, startFrameNumber, endFrameNumber});
  };

  const handleInsertAnimation = (name, layerIndex, position) => {
    caminiToons.insertAnimationClip({name, layerIndex, position});
  };

  const handleChangeOnionSkinSettings = (newOnionSkinSettings) => {
    caminiToons.changeOnionSkinSettings(newOnionSkinSettings);
  };

  const saveAnimationOnLocalStorage = () => {
    const serializedAnimationDocument = caminiToons.serializeAnimationDocument();
    console.log(serializedAnimationDocument);

    window.localStorage.setItem('animationDocument', JSON.stringify(serializedAnimationDocument));
  };

  const deleteAnimationFromLocalStorage = () => {
    window.localStorage.removeItem('animationDocument');
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

    handleChangeTool,
    handleCreateFrame,
    handleGoToFrame,
    handlePlayAnimation,
    handleStopAnimation,
    handleRepeatAnimation,
    handleToggleVisibility,
    handleToggleOnionSkin,
    handleActivateLayer,
    handleChangeFrameRate,
    handleChangeLayerName,
    handleCreateLayerClick,
    
    penStyle,
    handleChangePenStyle,

    eraserStyle,
    handleChangeEraserStyle,

    handleConvertToKeyFrame,
    handleExtendFrameOnLayer,
    handleCreateBefore,
    handleDeleteFrame,
    handleExtractToAnimationClip,
    handleInsertAnimation,

    onionSkinSettings,
    handleChangeOnionSkinSettings,

    saveAnimationOnLocalStorage,
    deleteAnimationFromLocalStorage
  }
}