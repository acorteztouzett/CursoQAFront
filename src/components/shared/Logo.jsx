import { Box, Text, Flex, useColorModeValue } from "@chakra-ui/react";

const Logo = ({ isSidebarOpen }) => {
  const textColor = useColorModeValue("gray.800", "gray.200");
  const shadowColor = useColorModeValue("rgba(0, 0, 0, 0.3)", "rgba(255, 255, 255, 0.3)");

  return (
    <Flex align="center" justify={isSidebarOpen ? "flex-start" : "center"} position="relative" mt={4} mb={4}>
      <Box display="inline-block" position="relative">
        <Text
          display={isSidebarOpen ? "inline-block" : "none"} // Mostrar el texto solo cuando el sidebar está abierto
          fontSize="4xl"
          fontWeight="bold"
          color={textColor}
          textShadow={`2px 2px ${shadowColor}`}
          position="relative"
          top={-2}
          left={-2}
          mr="-0.5rem">
          getlavado
        </Text>
        <Text
          display={isSidebarOpen ? "inline-block" : "none"}
          fontSize="sm"
          fontWeight="medium"
          color={textColor}
          textShadow={`1px 1px ${shadowColor}`}
          position="absolute"
          bottom={-2}
          right={-3}>
          CRM
        </Text>
      </Box>
    </Flex>
  );
};

export default Logo;
