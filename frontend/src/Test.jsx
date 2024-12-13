import React, { useRef, useEffect } from "react";

const Test = () => {
  const canvasRef = useRef(null);
  const gridSize = 50;
  const gridLength = 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const canvasSize = gridSize * gridLength;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.strokeStyle = "#000";

    // Vẽ các đường lưới
    for (let i = 0; i <= gridLength; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, gridSize * gridLength);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(gridSize * gridLength, i * gridSize);
      ctx.stroke();
    }
  }, []);

  return (
    <>
      <div className=" flex items-center justify-center">
        <canvas
          width={gridSize * gridLength}
          height={gridSize * gridLength}
          ref={canvasRef}
        ></canvas>
      </div>
    </>
  );
};

export default Test;
