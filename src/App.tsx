import React from 'react';
import View from './View';
import './App.scss';

function App() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    if (!canvasRef.current) return;
    const view = new View(canvasRef.current);
    view.animate();
  }, [canvasRef])
  return (
    <canvas ref={canvasRef} />
  );
}

export default App;
