import "./navigationComponent.css";
import { Menu } from "antd";
import { useState } from "react";
import HomeComponent from "../HomeComponent/HomeComponent"

const items = [
  {
    label: "O NAS",
    key: "dom",
    path: "/",
  },
  {
    label: "CENNIK",
    key: "cennik",
    path: "/cennik",
  },
  {
    label: "KONTAKT",
    key: "kontakt",
    icon: <HomeComponent/>,
  },
  {
    label: "REZERWACJA",
    key: "rezerwacja",
    href: "http://localhost:3000/rezerwacja",
  },
  {
    label: "WARUNKI WYNAJMU",
    key: "regulamin",
    href: "http://localhost:3000/regulamin",
  },
];

const NavigationComponent: React.FC = () => {
  const [current, setCurrent] = useState("dom");

  const onClick = (e: { key: React.Key }) => {
    console.log("click ", e);
    setCurrent(e.key.toString());
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
}

export default NavigationComponent;
