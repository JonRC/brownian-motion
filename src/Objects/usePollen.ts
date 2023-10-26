import { SimulatorParams } from "@/app/page";
import { Bodies, Body, Composite, Engine, IBodyDefinition } from "matter-js";
import { useEffect, useState } from "react";

type Props = {
  simulatorParams: SimulatorParams;
  engine: Engine | null;
};

const pollenProperties: IBodyDefinition = {
  friction: 0,
  frictionAir: 0,
  frictionStatic: 0,
  restitution: 1,
  slop: 0.05,
  collisionFilter: {
    category: 0x0002,
  },
  render: {
    fillStyle: "#d8d824",
  },
};

const historyLimit = 1000;

export const usePollen = (props: Props) => {
  const { screenSize, pollenRadius } = props.simulatorParams;
  const { engine } = props;

  const [pollenPosition, setPollenPosition] = useState({
    x: 0,
    y: 0,
  });

  const [pollen, setPollen] = useState<Body | null>(null);
  const [pollenHistory, setPollenHistory] = useState<
    { x: number; y: number }[]
  >([]);

  useEffect(() => {
    if (!engine) return;

    const pollen = Bodies.circle(
      screenSize / 2,
      screenSize / 2,
      pollenRadius,
      pollenProperties
    );

    Composite.add(engine.world, pollen);
    setPollen(pollen);

    return () => {
      Composite.remove(engine.world, pollen);
    };
  }, [screenSize, pollenRadius, engine]);

  useEffect(() => {
    const interval = setInterval(() => {
      const x = pollen?.position.x || 0;
      const y = pollen?.position.y || 0;

      setPollenPosition({
        x,
        y,
      });

      setPollenHistory((previous) => {
        if (previous.length >= historyLimit) {
          previous.shift();
        }
        return [...previous, { x, y }];
      });
    }, 150);

    return () => {
      clearInterval(interval);
    };
  }, [pollen]);

  return {
    pollenPosition,
    pollenHistory,
  };
};
