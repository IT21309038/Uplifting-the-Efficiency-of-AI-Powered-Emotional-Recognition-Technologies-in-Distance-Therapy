import { Box, Grid, Card, CardContent } from "@mui/material";
import { Image } from "antd";
import CustomHead from "@/utils/CustomHead";

const PageLayout = ({ title, children }) => (
  <>
    <CustomHead title={title} />
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 50px)",
        py: 2,
      }}
    >
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={10} md={6}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Image
              src="/images/logo/NEWLOGO.png"
              alt="logo"
              height={80}
              preview={false}
            />
          </Box>
          <Card>
            <CardContent sx={{ px: 6, py: 4 }}>{children}</CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  </>
);

export default PageLayout;
