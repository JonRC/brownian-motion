import { Bodies, Composite, Engine } from "matter-js";
import { useEffect } from "react";

type Props = {
  engine: Engine | null;
  trajectory: { x: number; y: number }[];
};

export const useTrajectory = (props: Props) => {
  const { engine, trajectory } = props;

  useEffect(() => {
    if (!engine) return;

    const trajectoryPoints = trajectory.map(({ x, y }) =>
      Bodies.circle(x, y, 1, {
        isStatic: true,
        collisionFilter: { group: -1, mask: 0x00004 },
        render: {
          fillStyle: "#1d00f9",
        },
      })
    );

    Composite.add(engine.world, trajectoryPoints);

    return () => {
      Composite.remove(engine.world, trajectoryPoints);
    };
  }, [trajectory, engine]);
};
