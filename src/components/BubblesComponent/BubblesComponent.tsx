import { FC } from "react";
import "./test.css";

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
    <div className="bubbles-container">
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
            background: "linear-gradient(to top, #dfe9f3 0%, white 100%)", // Example background color
          }}
        ></div>
      ))}
    </div>
  );
};

export default BubblesComponent;
