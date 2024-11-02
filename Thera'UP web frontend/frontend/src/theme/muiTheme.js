import { createTheme } from "@mui/material/styles";

const { palette } = createTheme();
const { augmentColor } = palette;

const createColor = (mainColor) =>
  augmentColor({
    color: {
      main: mainColor,
    },
  });

const muiTheme = createTheme({
  palette: {
    // themeOrange: {
    //   light: "#FF7042",
    //   main: "#FF5722",
    //   dark: "#DB3E0D",
    //   contrastText: "#FFF",
    // },
  },
});

export default muiTheme;
