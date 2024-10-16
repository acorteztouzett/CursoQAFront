import { useGetCompaniesListQuery } from "@/features/api/companies";
import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  VStack,
  Divider,
  Box,
  Link,
  Center,
  Button,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tooltip,
  Avatar,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react"; // Asegúrate de importar useEffect
import { Flex } from "@chakra-ui/react";
import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaListUl,
  FaBars,
} from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import Logo from "./Logo";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: companies = [], error, isLoading } = useGetCompaniesListQuery();

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Aquí es donde se agrega el efecto para reiniciar el estado de expansión cuando el sidebar se colapsa
  useEffect(() => {
    if (!isSidebarOpen) {
      setIsExpanded(false); // Si el sidebar se cierra, "Ver Más" volverá a su estado original.
    }
  }, [isSidebarOpen]);

  return (
    <VStack
      className="custom-scrollbar"
      spacing={2}
      align="stretch"
      fontSize="14px"
      overflowY="auto"
      mt={2}
      fontWeight="normal"
      w={isSidebarOpen ? { base: "200px", md: "280px" } : { base: "70px", md: "70px" }}
      transition="width 0.3s ease"
      boxShadow="md"
      bg="white"
      minH="100vh"
      maxH="100vh"
      ml={isSidebarOpen ? 0 : -4} // Reduced margin-left when sidebar is closed
      display="flex"
      flexDirection="column"
      alignItems={isSidebarOpen ? "stretch" : "center"} // Center elements when sidebar is closed
    >

      <Flex align="center" justify="flex-start" w="100%" mt={4} px={4}>
        <Button
          onClick={toggleSidebar}
          bg="none"
          _hover={{ textDecoration: "none", bg: "blue.50" }}
          mr={2} // Añade un margen a la derecha del botón
        >
          <FaBars size={isSidebarOpen? 20 : 0} />
        </Button>
        <Logo isSidebarOpen={isSidebarOpen} />
      </Flex>

      <Divider mb={0} mt={0} />

      {/*<Button
        position="fixed"
        top={120}
        mr={-4}
        onClick={toggleSidebar}
        bg="none"
        _hover={{ color: "gray" }}
        style={{ alignSelf: isSidebarOpen ? "flex-end" : "center" }} // Center button when sidebar is closed
        display={isSidebarOpen ? "block" : "none"}>
        <FaBars size={20} />
      </Button>}

      {/*<Center display={isSidebarOpen ? "none" : "flex"}>
        <Button bg="none" _hover={{ bg: "gray.50" }} onClick={toggleSidebar}>
          <ArrowRightIcon />
        </Button>
      </Center>*/}

      <NavItem
        icon={FaHome}
        label="Inicio"
        to="/"
        isSidebarOpen={isSidebarOpen}
      />
      <Divider mb={0} mt={0} />
      <NavItem
        icon={FaBuilding}
        label="Empresas"
        to="/companies"
        isSidebarOpen={isSidebarOpen}
      />

      {isSidebarOpen && (
        <Accordion allowMultiple>
          <AccordionItem>
            <h2>
              <AccordionButton
                _expanded={{ bg: "gray.100", color: "black" }}
                onClick={toggleExpansion}>
                <Box fontSize={14} as="span" flex="1" textAlign="left">
                  {isExpanded ? "Ver Menos" : "Ver Más"}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel>
              {isLoading && <Text>Loading...</Text>}
              {error && <Text>Error: {error.message}</Text>}
              {companies.map((company) => (
                <Link
                  as={RouterLink}
                  to={`/companies/${company._id}`}
                  key={company._id}
                  py={1}
                  _hover={{ textDecoration: "none", bg: "blue.50" }}
                  display="flex"
                  justifyContent={isSidebarOpen ? "start" : "center"}>
                  <Avatar
                    size="sm"
                    name={company.name}
                    src={company.logo ? company.logo : ""}
                  />
                  <Text ml={isSidebarOpen ? 4 : 0}>{company.name}</Text>
                </Link>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}

      <NavItem
        icon={FaUsers}
        label="Contactos"
        to="/contacts"
        isSidebarOpen={isSidebarOpen}
      /> 
      
      <NavItem icon={FaListUl} label="Tareas" to="/tasks" isSidebarOpen={isSidebarOpen} />

      <NavItem
        icon={FaUsers}
        label="Pedidos"
        to="/deals"
        isSidebarOpen={isSidebarOpen}
      />

    </VStack>
  );
};

const NavItem = ({ icon, label, to, isSidebarOpen }) => (
  <Tooltip label={label} placement="right" isDisabled={isSidebarOpen}>
    <Link
      as={RouterLink}
      to={to}
      py={2}
      px={isSidebarOpen ? 4 : 2}
      _hover={{ textDecoration: "none", bg: "blue.50" }}
      display="flex"
      alignItems="center"
      justifyContent={isSidebarOpen ? "start" : "center"}>
      {icon && React.createElement(icon)}
      {isSidebarOpen && <Box ml={4}>{label}</Box>}
    </Link>
  </Tooltip>
);

export default Sidebar;
