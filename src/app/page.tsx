"use client";

import { useEngine } from "@/Engine/createEngine";
import { useAtoms } from "@/Objects/useAtoms";
import { useBoundaries } from "@/Objects/useBoundaries";
import { usePollen } from "@/Objects/usePollen";
import { useTrajectory } from "@/Objects/useTrajectory";
import { randomVelocity } from "@/util/randomVelocity";
import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  IBodyDefinition,
  Render,
  Runner,
} from "matter-js";
import { useCallback, useEffect, useReducer, useState } from "react";

export type SimulatorParams = {
  atomQuantity: number;
  atomRadius: number;
  atomVelocityRange: number;
  pollenRadius: number;
  screenSize: number;
};

export default function Home() {
  const [simulatorParams, setSimulatorParams] = useReducer(
    (previous: SimulatorParams, next: Partial<SimulatorParams>) => ({
      ...previous,
      ...next,
    }),
    {
      atomQuantity: 1000,
      atomRadius: 1,
      atomVelocityRange: 1.5,
      pollenRadius: 10,
      screenSize: 400,
    }
  );

  const { screenSize } = simulatorParams;

  const { engine, render, canvasRef } = useEngine({ SCREEN_SIZE: screenSize });
  useBoundaries({ engine, simulatorParams });
  const { atoms, resetAtoms } = useAtoms({ simulatorParams, engine });

  const { atomVelocityRange } = simulatorParams;

  const { pollenPosition, pollenHistory } = usePollen({
    engine,
    simulatorParams,
  });

  useTrajectory({ engine, trajectory: pollenHistory });

  return (
    <main className="flex justify-start items-center w-screen h-screen gap-10">
      <canvas ref={canvasRef} width={screenSize} height={screenSize} />
      <div className="flex flex-col">
        <label id="atom-quantity" />
        <span className="text-gray-200">Quantidade de átomos</span>
        <input
          step={500}
          type="number"
          value={simulatorParams.atomQuantity}
          onChange={({ target }) =>
            setSimulatorParams({ atomQuantity: Number(target.value) })
          }
        />

        <label className="mt-5" id="atom-radius" />
        <span className="text-gray-200">Raio do átomo</span>
        <input
          step={0.1}
          type="number"
          value={simulatorParams.atomRadius}
          onChange={({ target }) =>
            setSimulatorParams({ atomRadius: Number(target.value) })
          }
        />

        <label className="mt-5" id="atom-velocity-range" />
        <span className="text-gray-200">Módulo da velocidade do átomo</span>
        <input
          step={0.1}
          type="number"
          value={simulatorParams.atomVelocityRange}
          onChange={({ target }) =>
            setSimulatorParams({ atomVelocityRange: Number(target.value) })
          }
        />

        <label className="mt-5" id="pollen-radius" />
        <span className="text-gray-200">Raio do pólen</span>
        <input
          step={0.2}
          type="number"
          value={simulatorParams.pollenRadius}
          onChange={({ target }) =>
            setSimulatorParams({ pollenRadius: Number(target.value) })
          }
        />

        <button
          className="text-black mt-5 bg-gray-200 h-10 rounded-md hover:bg-gray-300"
          onClick={() => resetAtoms()}
        >
          Reiniciar átomos
        </button>
      </div>
      <div className="flex flex-col">
        <span>Pólen</span>
        <span>x: {pollenPosition.x.toFixed(3)}</span>
        <span>y: {pollenPosition.y.toFixed(3)}</span>
      </div>
    </main>
  );
}

// const { atomQuantity, atomRadius, atomVelocityRange, pollenRadius } = simulatorParams;
