export const linearInterpolation = {
    applyTo: (firstValue, secondValue, index, numberOfInterpolatedFrames) => {
        const result = ((secondValue - firstValue) / (numberOfInterpolatedFrames + 1)) * (index + 1)
        // console.log(`((${secondValue} - ${firstValue}) / (${numberOfInterpolatedFrames} + 1)) * (${index} + 1) = ${result}`)
        return Math.floor(result + firstValue)
    }
};