import Navbar from "./components/shared/Navbar";
import Sidebar from "./components/shared/Sidebar";
import Footer from "./components/shared/Footer";
import "./styles/index.css";

import { Grid, GridItem } from "@chakra-ui/react";

import { useState } from "react";
import { Outlet } from "react-router-dom/dist";

export default function Root() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
     <Grid
        templateAreas={`"nav header"
                        "nav main"
                        "nav footer"`}
        gridTemplateRows={"auto 1fr auto"}  // Asegura que el main ocupe el espacio restante
        gridTemplateColumns={isSidebarOpen ? "250px 1fr" : "60px 1fr"}
        gap="1"
        minHeight="100vh"  // Garantiza que el grid ocupe todo el alto de la pantalla
        overflow="hidden"  // Evita el desbordamiento
        color="blackAlpha.700"
      >
        <GridItem
          p="2"
          pos="relative"
          bg="RGBA(0, 0, 0, 0.02)"
          w="100%"
          ml={1}
          mt={2}
          area={"header"}>
          <Navbar />
        </GridItem>
        <GridItem pl="2" ml={1} bg="RGBA(0, 0, 0, 0.02)" position="fixed" area={"nav"}>
          <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </GridItem>
        <GridItem area={"main"} minHeight="100%" overflow="auto">
          <Outlet />
        </GridItem>
        <GridItem bg="RGBA(0, 0, 0, 0.02)" area={"footer"}>
          <Footer />
        </GridItem>
      </Grid>
    </div>
  );
}
