import { randomNumber } from "@/util/randomNumber";

export const randomVelocity = (module: number) => {
  const angle = Math.random() * Math.PI * 2;
  const xVelocity = Math.cos(angle) * module;
  const yVelocity = Math.sin(angle) * module;

  return {
    x: xVelocity,
    y: yVelocity,
  };
};
