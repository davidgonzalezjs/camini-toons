import Column from '../Column';

export const ContextMenu = ({options}) =>
  <Column>
    {options.map(option =>
      <button onClick={onClick} key={text}>
        {text}
      </button>
    )}
  </Column>;