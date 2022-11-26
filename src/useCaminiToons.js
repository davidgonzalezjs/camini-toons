import { useState, useEffect } from 'react';


export function useCaminiToons(canvasRef, createCaminiToons) {
  const [caminiToons, setCaminiToons] = useState(null);
  
  const [layersDetails, setLayersDetails] = useState([]);
  const [animationClipsDetails, setAnimationClipsDetails] = useState([]);
  
  const [frameRate, setFrameRate] = useState(12);
  const [currentFrameNumber, setCurrentFrameNumber] = useState(1);
  const [lastFrameNumber, setLastFrameNumber] = useState(1);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingOnALoop, setIsPlayingOnALoop] = useState(false);
  
  const [toolsNames, setToolsNames] = useState([]);
  const [selectedToolName, setSelectedToolName] = useState('pen');
  
  const [penStyle, setPenStyle] = useState({});
  const [eraserStyle, setEraserStyle] = useState({});
  const [paintBucketStyle, setPaintBucketStyle] = useState({});

  const [onionSkinSettings, setOnionSkinSettings] = useState({ beforeColor: "red", afterColor: "green", numberOfFramesBefore: 3, numberOfFramesAfter: 3, opacityStep: 0.22 });

  useEffect(() => {
    if (window.caminiToons != undefined) return;
    
    const newCaminiToons = createCaminiToons(canvasRef.current);

    const animationDocumentJSON = window.localStorage.getItem('animationDocument');
    
    if (animationDocumentJSON !== null) {
      const serializedAnimationDocument = JSON.parse(animationDocumentJSON);
      
      newCaminiToons.deserializeAnimationDocument(serializedAnimationDocument);
    }

    newCaminiToons.registerListener({
      handleToolChanged() {
        setSelectedToolName(newCaminiToons.selectedTool.name);
        setPenStyle(newCaminiToons.penStyle);
        setEraserStyle(newCaminiToons.eraserStyle);
        setPaintBucketStyle(newCaminiToons.paintBucketStyle);
      },
      handleFrameChanged() {
        setCurrentFrameNumber(newCaminiToons.currentFrameNumber)
      },
      handleChangeLayerName() {
        setLayersDetails(newCaminiToons.flattenLayersDetails);
      },
      handleToggleVisibility() {
        setLayersDetails(newCaminiToons.flattenLayersDetails);
      },
      handleOnionSkinChanged() {
        setLayersDetails(newCaminiToons.flattenLayersDetails);
        setOnionSkinSettings(newCaminiToons.onionSkinSettings);
      },
      handleLayerUpdated() {
        setCurrentFrameNumber(newCaminiToons.currentFrameNumber)
        setLayersDetails(newCaminiToons.flattenLayersDetails);
        setLastFrameNumber(newCaminiToons.lastFrameNumber);
        setAnimationClipsDetails(newCaminiToons.animationClipsDetails);
      },
      handlePlayBackUpdated() {
        setIsPlaying(newCaminiToons.isPlaying());
        setIsPlayingOnALoop(newCaminiToons.isPlayingOnALoop());
      }
    });

    // // TODO: borrar lo de "xs". Era para chequear si se instanciaba mas de un caminiToons
    // if (window.caminiToons == undefined) {
    //   window.xs = []
    // }
    // window.xs.push(newCaminiToons)

    window.caminiToons = newCaminiToons;
    
    setCaminiToons(newCaminiToons);

    setSelectedToolName(newCaminiToons.selectedTool.name);
    setToolsNames(newCaminiToons.toolsNames);
    setFrameRate(newCaminiToons.frameRate);
    setCurrentFrameNumber(newCaminiToons.currentFrameNumber);
    setLastFrameNumber(newCaminiToons.lastFrameNumber);
    setLayersDetails(newCaminiToons.flattenLayersDetails);
    setIsPlayingOnALoop(newCaminiToons.isPlayingOnALoop());
    setPenStyle(newCaminiToons.penStyle);
    setOnionSkinSettings(newCaminiToons.onionSkinSettings);
  }, [canvasRef]);

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

  const handleChangePaintBucketStyle = (newStyle) => {
    caminiToons.changePaintBucketStyle(newStyle);
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

  const handleCreateTransformationLayerContaining = (layerIndex) => {
    caminiToons.createTransformationLayerContaining(layerIndex)
  };

  const handleChangeOnionSkinSettings = (newOnionSkinSettings) => {
    caminiToons.changeOnionSkinSettings(newOnionSkinSettings);
  };

  const saveAnimationOnLocalStorage = () => {
    const serializedAnimationDocument = caminiToons.serializeAnimationDocument();

    window.localStorage.setItem('animationDocument', JSON.stringify(serializedAnimationDocument));
  };

  const deleteAnimationFromLocalStorage = () => {
    window.localStorage.removeItem('animationDocument');
  };

  const saveToFile = () => {
    const animationDocumentJSON = JSON.stringify(caminiToons.serializeAnimationDocument());
    
    const data = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(animationDocumentJSON)
    )}`;
    
    const link=document.createElement('a');
    link.href = data;
    link.download = 'CaminiToons-animacion.animationDocument';
    
    link.click();
    link.remove();
  };

  const loadFromFile = async file => {
    const text = await file.text();
    caminiToons.deserializeAnimationDocument(JSON.parse(JSON.parse(text)));
  };  

  const importImage = url => {
    caminiToons.importImage(url);
  }

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

    paintBucketStyle,
    handleChangePaintBucketStyle,

    handleConvertToKeyFrame,
    handleExtendFrameOnLayer,
    handleCreateBefore,
    handleDeleteFrame,
    handleExtractToAnimationClip,
    handleInsertAnimation,

    handleCreateTransformationLayerContaining,
    
    onionSkinSettings,
    handleChangeOnionSkinSettings,

    saveAnimationOnLocalStorage,
    deleteAnimationFromLocalStorage,

    saveToFile,
    loadFromFile,

    importImage,

    model: caminiToons
  }
}