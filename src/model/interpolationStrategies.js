export const linearInterpolation = {
    applyTo: (value, index, numberOfInterpolatedFrames) =>
    (value / (numberOfInterpolatedFrames + 1)) * (index + 1)
};