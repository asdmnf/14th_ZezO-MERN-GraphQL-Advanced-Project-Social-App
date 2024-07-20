import { useState } from "react";
import { MenuMenu, MenuItem, Input, Menu } from "semantic-ui-react";

const Header = () => {
  const [activeItem, setActiveItem] = useState("home");
  const handleItemClick = (e, { name }) => setActiveItem(name);

  return (
    <Menu borderless pointing stackable  color="blue" style={{ position: "sticky", top: 0, zIndex: 100, marginBottom: 0 }}>
      <MenuItem
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
      />
      <MenuItem
        name="messages"
        active={activeItem === "messages"}
        onClick={handleItemClick}
      />
      <MenuItem
        name="friends"
        active={activeItem === "friends"}
        onClick={handleItemClick}
      />
      <MenuMenu position="right">
        <MenuItem>
          <Input icon="search" placeholder="Search..." />
        </MenuItem>
        <MenuItem
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
        />
        <MenuItem
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
        />
      </MenuMenu>
    </Menu>
  );
};

export default Header;
