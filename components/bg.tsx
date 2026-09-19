"use client";

import { useEffect, useRef } from "react";

export default function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const state = useRef({
    wWidth: 0,
    wHeight: 0,
    noiseData: [] as ImageData[],
    frame: 0,
    loopTimeout: 0,
    resizeThrottle: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error("Canvas not found")
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("2D context not supported or canvas not found")
    }

    const s = state.current

     const createNoise = () => {
    const idata = ctx.createImageData(s.wWidth, s.wHeight);
    const buffer32 = new Uint32Array(idata.data.buffer);
    let len = buffer32.length;

    while (len--) {
      buffer32[len] = ((Math.random() * 30) | 0) << 24;
    }

    s.noiseData.push(idata);
  };

   const paintNoise = () => {
    if (s.frame === 9) {
      s.frame = 0;
    } else {
      s.frame++;
    }

    ctx.putImageData(s.noiseData[s.frame], 0, 0);
  };

  const loop = () => {
    paintNoise();

    s.loopTimeout = window.setTimeout(() => {
      window.requestAnimationFrame(loop);
    }, 1000 / 25);
  };

  const setup = () => {
    s.wWidth = window.innerWidth;
    s.wHeight = window.innerHeight + 100;

   
      canvas.width = s.wWidth;
      canvas.height = s.wHeight;
   

    s.noiseData.length = 0;

    for (let i = 0; i < 10; i++) {
      createNoise();
    }

    loop();
  };

  setup()

    const resizeHandler = () => {
      window.clearTimeout(s.resizeThrottle);

      s.resizeThrottle = window.setTimeout(() => {
        window.clearTimeout(s.loopTimeout);
        setup();
      }, 200);
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      window.clearTimeout(s.loopTimeout);
      window.clearTimeout(s.resizeThrottle);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="noise"
      aria-label="bg noise"
      className="z-10 animate-fade-in fixed top-0"
    ></canvas>
  );
}
