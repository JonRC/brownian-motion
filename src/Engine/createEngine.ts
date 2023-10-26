import { Engine, Render, Runner } from "matter-js";
import { useEffect, useRef, useState } from "react";

type Props = {
  SCREEN_SIZE: number;
};

export const useEngine = (props: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { SCREEN_SIZE } = props;

  const [engine, setEngine] = useState<Engine | null>(null);
  const [render, setRender] = useState<Render | null>(null);
  const renderRef = useRef<Render>(render);

  useEffect(() => {
    const engine = Engine.create({
      gravity: { scale: 0 },
      velocityIterations: 10,
      positionIterations: 10,
    });

    const render = Render.create({
      engine,
      canvas: canvasRef.current as HTMLCanvasElement,
      options: {
        width: SCREEN_SIZE,
        height: SCREEN_SIZE,
        background: "#e6e6e6",
        wireframes: false,
        // showPerformance: true,
        // pixelRatio: 1
      },
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    setEngine(engine);
    setRender(render);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
    };
  }, [SCREEN_SIZE]);

  return {
    engine,
    render,
    canvasRef,
  };
};
