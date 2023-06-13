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
    const { offsetX, offsetY } = getCoordinates(event);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setDrawing(true);
  };

  const draw = (event) => {
    if (!drawing) return;
    const { offsetX, offsetY } = getCoordinates(event);
    ctx.lineTo(offsetX, offsetY);
    ctx.strokeStyle = color;
    ctx.stroke();
  };

  const endDrawing = () => {
    setDrawing(false);
    const canvasData = canvasRef.current.toDataURL();
    const newLine = { color, data: canvasData };
    setLines([...lines, newLine]);
  };

  const clearCanvas = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    setLines([]);
  };

  const sendLineToServer = () => {
    const newLine = lines[lines.length - 1];
    const data = {
      type: 'add_page_line',
      payload: {
        ...newLine,
      }
    };
    sendToServer({ client, data });
  };

  const receiveLineFromServer = (receivedLine) => {
    setLines([...lines, receivedLine]);
  };

  const getCoordinates = (event) => {
    let offsetX, offsetY;
    if (event.type.includes('touch')) {
      const touch = event.touches[0] || event.changedTouches[0];
      offsetX = touch.clientX - touch.target.offsetLeft;
      offsetY = touch.clientY - touch.target.offsetTop;
    } else {
      offsetX = event.nativeEvent.offsetX;
      offsetY = event.nativeEvent.offsetY;
    }
    return { offsetX, offsetY };
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
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
        style={{ border: '1px solid black' }}
      />
      <div className="d-flex"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: '1',
        }}
      >
        
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: '35px', height: '35px', marginRight: '10px', cursor: 'pointer',}}
          
        />
        <button
          onClick={clearCanvas}
          style={{
            width: '35px',
            height: '35px',
            // borderRadius: '50%',
            background: 'transparent',
            border: '1px solid transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
            }}
          >
            ♻
          </span>
        </button>
        {/* <button onClick={sendLineToServer}>Enviar línea</button> */}
      </div>
    </div>
  );
};

export default Canvas;