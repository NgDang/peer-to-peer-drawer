import React, { useRef, useEffect, useState } from 'react';
import Paper from 'paper';

const keyboardGame = ['a', 'd', 'w', 's'];
const step = 10;

const BoardGame = (props: any) => {
  const { id, dataDrawing, onUpdateDrawingData } = props;
  const canvasRef = useRef(null);
  const [keydown, setKeydown] = useState('');

  useEffect(() => {
    if (keydown) {
      if (keyboardGame.includes(keydown)) {
        const lengthData = dataDrawing?.length || 0;
        const point =
          lengthData > 0
            ? dataDrawing?.[lengthData - 1]?.positionTwo
            : { x: 100, y: 100 };
        const newPoint: any = { ...point };
        if (keydown === 'a') {
          newPoint.x -= step;
        } else if (keydown === 'd') {
          newPoint.x += step;
        } else if (keydown === 'w') {
          newPoint.y -= step;
        } else if (keydown === 's') {
          newPoint.y += step;
        }
        const data = {
          positionOne: point,
          positionTwo: newPoint,
        };
        setKeydown('');
        onUpdateDrawingData(data);
      }
    }
  }, [keydown]);

  const handleKeyDown = (event: any) => {
    setKeydown(event.key.toLowerCase());
  };

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      const canvas: any = canvasRef.current;
      Paper.setup(canvas);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} id={id} />
    </div>
  );
};

export default BoardGame;
