import React, { FC } from "react";
import "./bubblesComponent.css";

type Bubble = {
  top: string;
  left: string;
  height: string;
  width: string;
  borderRadius: string;
};

type BubblesProps = {
  animation?: boolean;
  bubbles: Bubble[];
};

const BubblesComponent: FC<BubblesProps> = ({ animation, bubbles }) => {
  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return (
    <div
      style={{
        position: "absolute",
        right: "0",
      }}
    >
      {bubbles.map((bubble, index) => {
        const animationDuration = `${getRandomInt(6, 10)}s`; // Random duration between 6s and 10s
        const animationDelay = `${getRandomInt(0, 4)}s`; // Random delay between 0s and 4s

        return (
          <div
            className="bubble"
            key={index}
            style={{
              top: bubble.top,
              left: bubble.left,
              height: bubble.height,
              width: bubble.width,
              borderRadius: bubble.borderRadius,
              animationDuration: animation ? animationDuration : undefined,
              animationDelay: animation ? animationDelay : undefined,
              animationName: animation ? "bubbleAnimation" : undefined,
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default BubblesComponent;
