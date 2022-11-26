import styled from 'styled-components'

export const Frame = styled.div`
  border-left: 1px ${props => props.isKeyFrame ? 'solid' : 'dashed'} darkgreen;
  
  &:first-child {
    border-left: 0;
  }

  &:last-child {
    border-right: 1px solid darkgreen;
  }

  width: 15px;

  background:
    linear-gradient(
      to right,
      
      ${props =>
        props.isNonExistingFrame ? 'lightgreen' :
        props.isAnimationClip ? 'blue' :
        props.isTransformationFrame ? 'CornflowerBlue ' :
        'greenyellow'} 40%,

      ${props =>
        props.isCurrentFrame ? 'red' :
        props.isNonExistingFrame ? 'lightgreen' :
        props.isAnimationClip ? 'blue' :
        props.isTransformationFrame ? 'CornflowerBlue ' :
        'greenyellow'} 40% 60%,
      
      ${props =>
        props.isNonExistingFrame ? 'lightgreen' :
        props.isAnimationClip ? 'blue' :
        props.isTransformationFrame ? 'CornflowerBlue ' :
        'greenyellow'} 60%
    );

  &::before {
    content: '${props => props.isKeyFrame && !props.isEmpty ? '*' : ''}';
  }
`;
