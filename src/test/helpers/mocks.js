import RegularFrame from "../../model/frames/RegularFrame";

export const mockPath = () => ({
    add: jest.fn(),
    simplify: jest.fn()
});

export const mockFunctionReturning = value => jest.fn(() => value);

export const mockFunctionReturningSequence = values => jest.fn(() => values.shift());

export const createFrameContent = () => ({
    activateOnionSkin: jest.fn(),
    showOnionSkin: jest.fn(),
    remove: jest.fn(),
    moveBy: jest.fn(),
    activate: jest.fn(),
    clone: () => createFrameContent(),
    position: {
        x: 0,
        y: 0
    },
    
    isEmpty: () => true,
    visible: true,
    serialize: () => ({visible: true})
});

export const mockLayer = () => ({
    createFrame: () => new RegularFrame(createFrameContent(), {isKeyFrame: true}),
    goToFrame: jest.fn(),
    numberOfFrames: jest.fn(),
    activate: jest.fn(),
    isEmpty: () => true
});


export const paper = {
    Path: {
        prototype: {}
    },
    Layer: function() {
        return mockLayer();
    },
    project: {
        hitTest: () => null
    }
}

export const createAnimationDocumentMockedProps = () => ({
    createFrameContent,
    createPath: mockPath,
    createCircle: mockPath,
    frameContentDeserializer: () => ({}),
    hitTest: () => null
});

export const animationDocumentMockedProps = createAnimationDocumentMockedProps();