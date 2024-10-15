import { Box } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box
      pt="10"
      textAlign="center"
      className="text-xs"
      bg="gray.800"         // Cambia el color de fondo
      color="white"         // Cambia el color del texto
      borderTop="1px solid" // Agrega un borde superior
      borderColor="gray.600" // El color del borde
      py="5"                // Añade más padding vertical
    >
      © GetLavado. Todos los derechos reservados.
    </Box>
  );
};

export default Footer;
