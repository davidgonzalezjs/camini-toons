import styled, {css} from 'styled-components'

const Box = styled.div`
  ${props => props.center && css`
  margin-left: auto;
  margin-right: auto;
  `}
`;

export default Box;