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
            background:
              "radial-gradient(592px at 48.2% 50%, rgba(255, 255, 249, 0.6) 0%, rgb(160, 199, 254) 74.6%)", // Example background color
          }}
        ></div>
      ))}
    </div>
  );
};

export default BubblesComponent;
