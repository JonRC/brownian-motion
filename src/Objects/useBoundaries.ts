import { SimulatorParams } from "@/app/page";
import {
  Bodies,
  Body,
  Composite,
  Engine,
  IChamferableBodyDefinition,
} from "matter-js";
import { useEffect } from "react";

const boundaryProperties: IChamferableBodyDefinition = {
  isStatic: true,
  render: {
    fillStyle: "#000000",
  },
  restitution: 1,
  slop: 0,
  friction: 0,
  frictionAir: 0,
  frictionStatic: 0,
  collisionFilter: {
    // group: 1,
    category: 0x0002,
  },
};

type Props = {
  simulatorParams: SimulatorParams;
  engine: Engine | null;
};

export const useBoundaries = (props: Props) => {
  const { screenSize } = props.simulatorParams;

  useEffect(() => {
    if (!props.engine) return;
    const size = 10;
    const adjust = size / 2 - 3;

    Composite.add(props.engine.world, [
      Bodies.rectangle(-adjust, 0, size, screenSize * 3, boundaryProperties),
      Bodies.rectangle(
        screenSize + adjust,
        0,
        size,
        screenSize * 3,
        boundaryProperties
      ),
      Bodies.rectangle(0, -adjust, screenSize * 3, size, boundaryProperties),
      Bodies.rectangle(
        0,
        screenSize + adjust,
        screenSize * 3,
        size,
        boundaryProperties
      ),
    ]);
  }, [props.engine, screenSize]);
};
