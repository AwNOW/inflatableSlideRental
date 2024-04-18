import React, { FC } from "react";

type Bubble = {
  top: string;
  left: string;
  height: string;
  width: string;
  borderRadius: string;
};

type BubblesProps = {
  bubbles: Bubble[];
};

const BubblesComponent: FC<BubblesProps> = ({ bubbles }) => {
  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      {bubbles.map((bubble, index) => {
        const animationDuration = `${getRandomInt(6, 10)}s`; // Random duration between 6s and 10s
        const animationDelay = `${getRandomInt(0, 4)}s`; // Random delay between 0s and 4s
        const animationName = `riseBubble-${index}`;

        return (
          <div
            className="bubble"
            key={index}
            style={{
              position: "absolute",
              top: bubble.top,
              left: bubble.left,
              height: bubble.height,
              width: bubble.width,
              borderRadius: bubble.borderRadius,
              background: " linear-gradient(#ffff, #BCEAF6)",
              animationName: animationName,
              animationDuration: animationDuration,
              animationTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
              animationIterationCount: "infinite",
              animationDelay: animationDelay,
            }}
          ></div>
        );
      })}
      {/* CSS Keyframe Animations */}
      <style>
        {bubbles.map(
          (bubble, index) =>
            `@keyframes riseBubble-${index} {
              0% { transform: translateY(0); }
              50% { transform: translateY(-80px); }
              100% { transform: translateY(0); }
          }`
        )}
      </style>
    </div>
  );
};

export default BubblesComponent;
