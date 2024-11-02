import { ThemeProvider } from "@mui/material/styles";
import { Breadcrumb, ConfigProvider, Image, Layout, Menu, theme } from "antd";
import { useEffect, useState } from "react";
import antdTheme from "@/theme/antdTheme";
import muiTheme from "@/theme/muiTheme";
import { useRouter } from "next/router";
import { Alert, Box, Typography } from "@mui/material";

import { navigation } from "@/navigation/nav";
import { subNavRoutes } from "@/navigation/subroutes";

import { Icon } from "@iconify/react";

import { SessionProvider } from "next-auth/react";

import PropTypes from "prop-types";

import "@/styles/globals.css";

import Appbar from "@/components/layout/AppBar";

import AuthWrapper from "@/utils/AuthWrapper";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavMenu from "@/components/layout/NavMenu";

const { Header, Content, Footer, Sider } = Layout;

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [defaultKey, setDefaultKey] = useState("");
  const [breadcrumb, setBreadcrumb] = useState([]);

  const envType = process.env.NEXT_PUBLIC_ENV;
  const [hostName, setHostName] = useState("");
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostName(window.location.hostname);
    }
  }, []);

  const {
    token: {
      colorBgContainer,
      // borderRadiusLG
    },
  } = theme.useToken();

  const router = useRouter();
  const exclusions = [
    "/404",
    "/500",
    "/401",
    "/api/*",
    "/auth/*",
    "/insecure/*",
  ];

  function isExcludedPath(path, exclusions) {
    return exclusions.some((exclusion) => {
      if (exclusion.includes("*")) {
        const regex = new RegExp("^" + exclusion.replace("*", ".*"));
        return regex.test(path);
      }
      return path === exclusion;
    });
  }

  const isExcluded = isExcludedPath(router.pathname, exclusions);

  const findMenuItem = (items, key) => {
    for (const item of items) {
      if (item.key === key) {
        return item;
      }
      if (item.children) {
        const childItem = findMenuItem(item.children, key);
        if (childItem) {
          return childItem;
        }
      }
    }
    return null;
  };

  const findCurrentKey = () => {
    const findKeyByPath = (items, path) => {
      for (const item of items) {
        if (item.path === path) {
          return item.key;
        }
        if (item.children) {
          const childKey = findKeyByPath(item.children, path);
          if (childKey) {
            return childKey;
          }
        }
      }
      return null;
    };

    let currentKey = findKeyByPath(navigation, router.pathname);

    if (currentKey) {
      const currentItem = findMenuItem(navigation, currentKey);
      setDefaultKey(currentKey);
      setBreadcrumb([
        {
          title: <Icon icon="ant-design:home-filled" />,
          href: "/",
        },
        ...currentItem.breadcrumb,
      ]);
    } else {
      const subNavItem = subNavRoutes.find(
        (subNav) => subNav.path === router.pathname
      );
      if (subNavItem) {
        currentKey = subNavItem.pID;
        setDefaultKey(currentKey);
        setBreadcrumb([
          {
            title: <Icon icon="ant-design:home-filled" />,
            href: "/",
          },
          ...subNavItem.breadcrumb,
        ]);
      }
    }
  };

  const handleMenuClick = (e) => {
    const selectedItem = findMenuItem(navigation, e.key);
    if (selectedItem?.path) {
      router.push(selectedItem.path);
    }
  };

  useEffect(() => {
    findCurrentKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  return (
    <>
      <ToastContainer />
      <SessionProvider session={session}>
        <AuthWrapper>
          <ConfigProvider theme={antdTheme}>
            <ThemeProvider theme={muiTheme}>
              {isExcluded ? (
                <Component {...pageProps} />
              ) : (
                <Layout style={{ minHeight: "100vh" }}>
                  <Sider
                    width={230}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    theme="dark"
                    style={{
                      height: "100vh",
                      overflowY: "hidden",
                      position: "fixed",
                      left: 0,
                      top: 0,
                      bottom: 0,
                    }}
                  >
                    <Box
                      sx={
                        collapsed
                          ? {
                              paddingLeft: 1,
                              paddingRight: 0.5,
                              py: 1.5,
                              gap: 0.5,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }
                          : {
                              p: 2,
                              gap: 0.5,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }
                      }
                    >
                      <Image
                        src={
                          collapsed
                            ? "/images/logo/brandLogo-NEW.png"
                            : "/images/logo/NEWLOGO.png"
                        }
                        alt="logo"
                        width="75%"
                        preview={false}
                      />
                      {collapsed ? null : (
                        <Typography
                          variant="h6"
                          fontWeight={500}
                          sx={{
                            color: "white",
                            textAlign: "center",
                            letterSpacing: "0.05em",
                            mt: 1,
                          }}
                        >
                          Ticketing System
                        </Typography>
                      )}
                    </Box>
                    <Box
                      style={{
                        overflowY: "scroll",
                        height: "calc(100vh - 130px)",
                        scrollbarWidth: "none",
                      }}
                    >
                      <NavMenu
                        navigation={navigation}
                        defaultKey={defaultKey}
                        handleMenuClick={handleMenuClick}
                      />
                    </Box>
                  </Sider>
                  <Layout
                    style={{
                      marginLeft: collapsed ? 80 : 230,
                    }}
                  >
                    <Header
                      style={{
                        padding: 0,
                        background: colorBgContainer,
                        margin: "10px 16px 0px",
                        borderRadius: "10px",
                        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.25)",
                      }}
                    >
                      <Appbar />
                    </Header>
                    <Content style={{ margin: "5px 16px" }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: {
                            sm: "wrap",
                            md: "nowrap",
                          },
                        }}
                      >
                        <Breadcrumb
                          style={{ margin: "16px 0" }}
                          separator=">"
                          items={breadcrumb}
                        />
                        {(envType === "DEV" || envType === "UAT") && (
                          <Alert
                            severity="error"
                            sx={{ my: 1.5 }}
                            variant="filled"
                          >
                            You are in {envType} mode on <em>{hostName}</em> and
                            using{" "}
                            <em>{apiURL.replace(/https?:\/\/|\/.*/g, "")}</em>
                          </Alert>
                        )}
                      </Box>
                      <Component {...pageProps} />
                    </Content>
                    <Footer style={{ textAlign: "center" }}>
                      KIU Ticketing System ©{new Date().getFullYear()}. Made
                      with ❤️ by&nbsp;
                      <a href="#">Software Engineering Division - KIU</a>
                    </Footer>
                  </Layout>
                </Layout>
              )}
            </ThemeProvider>
          </ConfigProvider>
        </AuthWrapper>
      </SessionProvider>
    </>
  );
};

export default App;

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
