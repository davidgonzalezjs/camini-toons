import styled from 'styled-components';

const CoverArea = styled.div`
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
`;

export const ModalArea = ({show, onClickOutside, children}) =>
  <div style={{position: 'absolute', display: show ? 'block' : 'none', top: '30%', right: '50%' }}>
    <CoverArea onClick={onClickOutside} />
    {children}
  </div>;