

import React, { useRef, useLayoutEffect, useState, useContext } from 'react';
import { RoomContext } from '../../../contexts';

const Canvas = () => {
  const { sendToServer, roomData } = useContext(RoomContext);
  const { client } = roomData
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lines, setLines] = useState([]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setCtx(context);
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 18;
    canvas.height = window.innerHeight - 18;
  };

  const startDrawing = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setDrawing(true);
  };

  const draw = (event) => {
    if (!drawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    ctx.lineTo(offsetX, offsetY);
    ctx.strokeStyle = color;
    ctx.stroke();
  };

  const endDrawing = () => {
    setDrawing(false);
    const canvasData = canvasRef.current.toDataURL(); // Convert canvas to base64 image
    const newLine = { color, data: canvasData };
    setLines([...lines, newLine]);
  };

  const clearCanvas = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    setLines([]);
  };

  const sendLineToServer = () => {
    const newLine = lines[lines.length - 1];
    // Send newLine to the server using your preferred method (e.g., fetch)
    console.log('Sending line to server:', newLine);

    const data = {
      type: 'add_page_line',
      payload: {
        ...newLine,
      }
    };

    sendToServer({ client, data });

  };

  const receiveLineFromServer = (receivedLine) => {
    // Receive line from server and draw it on the canvas
    setLines([...lines, receivedLine]);
  };

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        style={{ border: '1px solid black' }}
      />
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: '1',
        }}
      >
        <label>Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button onClick={clearCanvas}>Borrar todo</button>
        <button onClick={sendLineToServer}>Enviar línea</button>
      </div>
    </div>
  );

};

export default Canvas;
