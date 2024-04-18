import { FC } from "react";

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
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      {bubbles.map((bubble, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: bubble.top,
            left: bubble.left,
            height: bubble.height,
            width: bubble.width,
            borderRadius: bubble.borderRadius,
            background: " linear-gradient(#ffff, #BCEAF6)",
          }}
        ></div>
      ))}
    </div>
  );
};

export default BubblesComponent;
