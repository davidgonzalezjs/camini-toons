export const linearInterpolation = {
    applyTo: (firstValue, secondValue, index, numberOfInterpolatedFrames) =>
        Math.floor(((secondValue - firstValue) / (numberOfInterpolatedFrames + 1)) * (index + 1) + firstValue)
};