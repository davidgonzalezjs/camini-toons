import {useState, useEffect, useCallback} from 'react';

export const useContextMenu = ({onRightClick}) => {
  const [position, setPosition] = useState({x: 0, y: 0});
  const [showMenu, setShowMenu] = useState(false);
  const [contextMenuTarget, setContextMenuTarget] = useState(null);
  
  const handleContextMenu = useCallback(event => {
      event.preventDefault();

      const shouldShow = onRightClick(event);
    
      setShowMenu(shouldShow);
      setPosition({x: event.pageX, y: event.pageY});
      setContextMenuTarget(event.target);
    }, [position]
  );
  
  const handleClick = useCallback(() => {
    showMenu && setShowMenu(false);
  }, [showMenu]);
  
  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);
    
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });
   
  return { position, showMenu, contextMenuTarget };
};