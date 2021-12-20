import React, { useRef, useEffect } from 'react';
import Paper from 'paper';

const Board = (props: any) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas: any = canvasRef.current;
    Paper.setup(canvas);
    // Drawer();
  }, []);

  // const handleClear = () => {
  // 	Paper.project.activeLayer.removeChildren();
  // 	(Paper as any).view.draw();
  // 	setRandom(Math.random())
  // }

  return (
    <div>
      <canvas ref={canvasRef} {...props} id="canvas" resize />
    </div>
  );
};

export default Board;
