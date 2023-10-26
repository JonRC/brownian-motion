import { SimulatorParams } from "@/app/page";
import { randomBoolean } from "@/util/randomBoolean";
import { randomVelocity } from "@/util/randomVelocity";
import { Bodies, Body, Composite, Engine, IBodyDefinition } from "matter-js";
import { useCallback, useEffect, useState } from "react";

const atomProperties: IBodyDefinition = {
  render: {
    fillStyle: "#d82424",
  },
  restitution: 1,
  friction: 0,
  frictionAir: 0,
  frictionStatic: 0,
  slop: 0,
  collisionFilter: {
    category: 0x0001,
    mask: 0x0002,
  },
};

type Props = {
  simulatorParams: SimulatorParams;
  engine: Engine | null;
};

export const useAtoms = (props: Props) => {
  const { simulatorParams, engine } = props;
  const { atomQuantity, atomVelocityRange } = simulatorParams;

  const [atoms, setAtoms] = useState<Body[]>(
    Array.from({ length: simulatorParams.atomQuantity }, () => {
      const atom = createAtom(simulatorParams);
      return atom;
    })
  );

  useEffect(() => {
    if (!engine) return;
    Composite.add(engine.world, atoms);

    return () => {
      if (!engine) return;
      Composite.remove(engine.world, atoms);
    };
  }, [engine]);

  useEffect(() => {
    const interval = setInterval(() => {
      atoms.forEach((atom) => {
        const mayChangeVelocity = randomBoolean(0.5);
        if (!mayChangeVelocity) return;

        Body.setVelocity(atom, randomVelocity(atomVelocityRange));
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [atomVelocityRange, atoms]);

  const resetAtoms = useCallback(() => {
    if (!engine) return;
    Composite.remove(engine.world, atoms);

    const newAtoms = Array.from({ length: atomQuantity }, () =>
      createAtom(simulatorParams)
    );
    Composite.add(engine.world, newAtoms);
    setAtoms(newAtoms);
  }, [atomQuantity, simulatorParams, engine, atoms]);

  return {
    atoms,
    resetAtoms,
  };
};

const createAtom = (simulatorParams: SimulatorParams) => {
  const { screenSize, atomVelocityRange } = simulatorParams;

  const x = Math.random() * screenSize;
  const y = Math.random() * screenSize;
  const atom = Bodies.circle(x, y, simulatorParams.atomRadius, atomProperties);
  Body.setVelocity(atom, randomVelocity(atomVelocityRange));
  return atom;
};
