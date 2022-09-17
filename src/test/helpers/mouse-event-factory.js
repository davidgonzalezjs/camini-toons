export const clickEvent = (aPosition = {x:1, y: 2}) => ({point: aPosition});

export const mouseDragEvent = (aPosition) => ({point: aPosition});

export const mouseUpEvent = (aPosition) => ({point: aPosition});

export const mouseMoveEvent = (delta = {x: 10, y: 20}) => ({delta});