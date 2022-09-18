export const mockPath = () => ({
    add: jest.fn(),
    simplify: jest.fn()
});

export const mockLayer = () => ({
    createFrame: jest.fn(),
    goToFrame: jest.fn(),
    numberOfFrames: jest.fn(),
    activate: jest.fn(),
});

export const mockFunctionReturning = value => jest.fn(() => value);

export const mockFunctionReturningSequence = values => jest.fn(() => values.shift());
