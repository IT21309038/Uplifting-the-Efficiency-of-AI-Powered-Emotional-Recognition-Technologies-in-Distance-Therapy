import { Typography } from "@mui/material";
import { Menu } from "antd";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const NavMenu = ({ navigation, defaultKey, handleMenuClick }) => {
  const { data: session } = useSession();

  const [filterdNavigation, setFilteredNavigation] = useState([]);

  useEffect(() => {
    console.log("session", session);
    console.log("navigation", navigation);
    if (session) {
      const filtered = navigation.filter((nav) => {
        if (nav.allowedRoles.includes(session?.user?.role?.role_name)) {
          if (nav.children) {
            nav.children = nav.children.filter((child) =>
              child?.allowedRoles?.includes(session?.user?.role?.role_name)
            );
          }
          return true;
        }
        return false;
      });
      setFilteredNavigation(filtered);
    }
  }, [session, navigation]);
  return (
    <Menu
      theme="dark"
      defaultSelectedKeys={[defaultKey]}
      selectedKeys={[defaultKey]}
      mode="inline"
      items={filterdNavigation}
      onClick={handleMenuClick}
    />
  );
};

export default NavMenu;
