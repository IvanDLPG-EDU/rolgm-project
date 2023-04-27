import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

const ToolBar = ({ canvas, lineWidth, setLineWidth }) => {
  const fileInputRef = useRef(null);
  const handleClearCanvas = () => {
    if (canvas) {
      canvas.clear();
      canvas.renderAll();
    }
  };

  const handleExport = () => {
    if (canvas) {
      const jsonData = JSON.stringify(canvas.toJSON());
      console.log(jsonData);
    }
  };

  const handleImport = (event) => {
    if (canvas) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const jsonData = event.target.result;
        canvas.loadFromJSON(jsonData, canvas.renderAll.bind(canvas));
      };
      reader.readAsText(file);
      fileInputRef.current.value = null; // establecer el valor del input en una cadena vacía
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <button onClick={handleClearCanvas}>Clear</button>
      <button onClick={handleExport}>Export</button>
      <input type="file" accept=".json" ref={fileInputRef} onChange={handleImport} />
      <input
        type="range"
        value={lineWidth}
        min="1"
        max="50"
        onChange={(event) => setLineWidth(event.target.value)}
      />
    </div>
  );
};























export const Canvas = () => {
  const DEFAULT_BRUSH_WIDTH = 1;

  const [canvas, setCanvas] = useState(null);
  const [lineWidth, setLineWidth] = useState(DEFAULT_BRUSH_WIDTH);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvasInstance = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      width: window.innerWidth,
      height: window.innerHeight,
    });

    setCanvas(canvasInstance);

    const handleResize = () => {
      canvasInstance.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      canvasInstance.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (canvas) {
      canvas.freeDrawingBrush.width = lineWidth;
    }
  }, [lineWidth]);

  useEffect(() => {
    if (canvas) {
      canvas.on('pointermove', (event) => {
        if (event.pointerType === 'mouse') {
          const pointer = canvas.getPointer(event.e);
          const x = pointer.x;
          const y = pointer.y;
          // hacer algo con las coordenadas x e y
        }
      });
    }
  }, [canvas]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
      />
      {canvas && (
        <ToolBar canvas={canvas} lineWidth={lineWidth} setLineWidth={setLineWidth} />
      )}
    </>
  );
};



export default Canvas;

















// import React, { useState, useEffect, useRef } from 'react';
// import { fabric } from 'fabric';

// export const Canvas = () => {

//   const DEFAULT_BRUSH_WIDTH = 10;

//   const [canvas, setCanvas] = useState(null);
//   const [canvasDimensions, setCanvasDimensions] = useState({
//     width: window.innerWidth,
//     height: window.innerHeight
//   });

//   const [lineWidth, setLineWidth] = useState(10);

//   const canvasRef = useRef(null);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const canvasInstance = new fabric.Canvas(canvasRef.current, {
//       isDrawingMode: true,
//       backgroundColor: 'lightgray',
//       width: canvasDimensions.width,
//       height: canvasDimensions.height,
//       freeDrawingBrush: {
//         width: DEFAULT_BRUSH_WIDTH
//       }
//     });

//     setCanvas(canvasInstance);

//     const handleResize = () => {
//       setCanvasDimensions({
//         width: window.innerWidth,
//         height: window.innerHeight
//       });
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       canvasInstance.dispose();
//       window.removeEventListener('resize', handleResize);
//     };
//   }, [canvasDimensions]);

//   const handleClearCanvas = () => {
//     if (canvas) {
//       canvas.clear();
//       canvas.backgroundColor = 'lightgray';
//       canvas.renderAll();
//     }
//   };

//   const handleExport = () => {
//     if (canvas) {
//       const jsonData = JSON.stringify(canvas.toJSON());
//       console.log(jsonData);
//     }
//   };

//   const handleImport = (jsonData) => {
//     if (canvas) {
//       canvas.loadFromJSON(jsonData, canvas.renderAll.bind(canvas));
//       fileInputRef.current.value = null; // establecer el valor del input en una cadena vacía
//     }
//   };

//   const handleLineWidthChange = (event) => {
//     setLineWidth(event.target.value);
//     canvas.freeDrawingBrush.width = lineWidth;
//   };

//   return (
//     <>
//       <canvas
//         ref={canvasRef}
//         style={{ width: '100%', height: '100%' }}
//       />
//       <button
//         onClick={handleClearCanvas}
//         style={{
//           position: 'absolute',
//           top: '10px',
//           left: '10px',
//           zIndex: 1
//         }}
//       >
//         Clear
//       </button>
//       <button
//         onClick={handleExport}
//         style={{
//           position: 'absolute',
//           top: '10px',
//           left: '70px',
//           zIndex: 1
//         }}
//       >
//         Export
//       </button>
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept=".json"
//         onChange={(e) => {
//           const files = e.target.files;
//           if (files && files.length > 0) {
//             const file = files[0];
//             const reader = new FileReader();
//             reader.onload = (event) => {
//               const jsonData = event.target.result;
//               handleImport(jsonData);
//             };
//             reader.readAsText(file);
//           }
//         }}
//         style={{
//           position: 'absolute',
//           top: '10px',
//           left: '130px',
//           zIndex: 1
//         }}
//       />

//       <input
//         type="range"
//         min="1"
//         max="50"
//         value={lineWidth}
//         onChange={handleLineWidthChange}
//         style={{
//           position: 'absolute',
//           top: '10px',
//           left: '60px',
//           zIndex: 1
//         }}
//       />
//     </>
//   );
// };