import "./navigationComponent.css";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../images/castle.png";

type MenuItem = {
  label: string;
  key: string;
  target: string;
};

const items: MenuItem[] = [
  {
    label: "O NAS",
    key: "home",
    target: "/",
  },
  {
    label: "CENNIK",
    key: "priceList",
    target: "/cennik",
  },
  {
    label: "KONTAKT",
    key: "contact",
    target: "/kontakt",
  },
  {
    label: "REZERWACJA",
    key: "reservation",
    target: "/rezerwacja",
  },
  {
    label: "WARUNKI WYNAJMU",
    key: "statute",
    target: "/regulamin",
  },
];

const NavigationComponent: React.FC = () => {
  const [current, setCurrent] = useState<string>("home");
  const navigate = useNavigate();
  const location = useLocation();

  const getKeyFromPath = (path: string): string => {
    const item = items.find((item) => item.target === path);
    return item!.key;
  };

  useEffect(() => {
    setCurrent(getKeyFromPath(location.pathname));
  }, [location.pathname]);

  const handleMenuClick = ({ key }: { key: MenuItem["key"] }) => {
    const { target } = items.find((item) => item.key === key) || {};
    setCurrent(key);
    if (target) {
      navigate(target);
    }
  };

  return (
    <div>
      <nav className="top-bar">
        <img src={logo} alt="Logo" />
        <Menu
          style={{
            fontSize: "16px",
          }}
          mode="horizontal"
          selectedKeys={[current]}
          defaultSelectedKeys={["2"]}
          items={items}
          onClick={handleMenuClick}
        />
      </nav>
    </div>
  );
};

export default NavigationComponent;
