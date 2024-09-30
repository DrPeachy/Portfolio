import React, { useEffect } from 'react';

const GameDebugger = () => {
  useEffect(() => {
    const handleClick = (e) => {
      console.log('Clicked element:', e.target); // Log the clicked element
      // debugger; // This will trigger a breakpoint in your developer tools when the click event occurs
    };

    // Add event listener to the whole document
    document.addEventListener('click', handleClick);

    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null; // This component is only used for debugging, no rendering needed
};

export default GameDebugger;
