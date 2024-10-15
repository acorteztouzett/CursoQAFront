import { useState, useMemo } from "react";
import { SocialIcon } from "react-social-icons";
import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  Text,
  Heading,
  Button,
  SimpleGrid,
  Center,
  useDisclosure,
  Box,
  HStack,
  Tooltip,
  Spinner,
  Input,
  Avatar,
  VStack,
} from "@chakra-ui/react";
import { useGetContactsListQuery } from "@/features/api/contacts";
import { AddIcon, DeleteIcon, EditIcon, EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import CreateContactForm from "./CreateContactForm";
import ContactDelete from "./ContactDelete";
import Icons from "../companies/CompaniesIcons";

const ContactsList = ({ isSidebarOpen }) => {
  const { data: contacts, error, isLoading } = useGetContactsListQuery();
  const {
    isOpen: isOpAddMod,
    onOpen: onOpAddMod,
    onClose: closeAddMod,
  } = useDisclosure();
  const {
    isOpen: isOpDeleteMod,
    onOpen: onOpDeleteMod,
    onClose: closeDeleteMod,
  } = useDisclosure();
  const [deleteContact, setDeleteContact] = useState(null);
  const [deleteContactName, setDeleteContactName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteClick = (contact) => {
    setDeleteContact(contact._id);
    setDeleteContactName(contact.firstName + " " + contact.lastName);
    onOpDeleteMod();
  };

  const filteredContacts = useMemo(() => {
    return contacts?.filter(
      (contact) =>
        contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [contacts, searchTerm]);

  const getRandomIcon = () => {
    const iconKeys = Object.keys(Icons);
    const randomKey = iconKeys[Math.floor(Math.random() * iconKeys.length)];
    return Icons[randomKey];
  };

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center height="100vh" className="px-4">
        <Text color="red.500">{error.message}</Text>
      </Center>
    );
  }

  return (
    <Box
      ml={isSidebarOpen ? "250px" : "70px"} // Ajusta el margen dependiendo del sidebar
      transition="margin-left 0.3s ease"  // Transición suave al abrir/cerrar el sidebar
      p={4}  // Padding interno para darle espacio alrededor
    >
      <Heading as="h1" size="xl" mb={6}>
        <HStack justify="space-between">
          <Text>Contactos</Text>
          <Button leftIcon={<AddIcon />} onClick={onOpAddMod}>
            Añadir contacto
          </Button>
        </HStack>
        <CreateContactForm isOpen={isOpAddMod} onClose={closeAddMod} />
      </Heading>
      <Input
        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />
      <SimpleGrid spacing={6} templateColumns="repeat(auto-fill, minmax(250px, 1fr))">
        {filteredContacts.map((contact) => {
          const IconComponent = getRandomIcon();
          return (
            <Card
              key={contact._id}
              bgGradient="linear(to-t, RGBA(0, 0, 0, 0.06), #FFFFFF)"
              boxShadow="md"
              rounded="md"
              _hover={{ boxShadow: "xl" }}
              p={4}
              overflow="hidden"
            >
              <CardBody p={4}>
                <VStack>
                  <Center>
                    {contact.logo ? (
                      <Avatar src={contact.logo} size="md" />
                    ) : (
                      <Box borderRadius="50px" p={2} color="white" bg="gray.200">
                        <IconComponent size={40} />
                      </Box>
                    )}
                  </Center>
                  <Center>
                    <Text p={4} fontSize={22} fontWeight="medium">
                      {contact.firstName} 
                    </Text>
                  </Center>
                </VStack>
                <Center>
                  <Text p={0} fontSize={22} marginTop={-4} fontWeight="medium">
                    {contact.lastName}
                  </Text>
                </Center>
                <Center>
                  <HStack spacing={2} mt={2} p={4}>
                    <Box>
                      {contact.socials?.LinkedIn && (
                        <SocialIcon
                          url={contact.socials.LinkedIn}
                          style={{ width: "40px", height: "40px", marginRight: "15px" }}
                        />
                      )}
                      
                      {contact.socials?.Facebook && (
                        <SocialIcon
                          url={contact.socials.Facebook}
                          style={{ width: "40px", height: "40px", marginRight: "15px" }}
                        />
                      )}
                      
                      {contact.socials?.X && (
                        <SocialIcon
                          url={contact.socials.X}
                          style={{ width: "40px", height: "40px", marginRight: "15px" }}
                        />
                      )}
                    </Box>
                  </HStack>
                </Center>

              </CardBody>
              <CardFooter h={30} justifyContent="center" flexWrap="unset">
                <HStack spacing={6}>
                  <Button
                    color="white"
                    variant="ghost"
                    as={RouterLink}
                    to={`/contacts/${contact._id}`}
                    size="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    w="40px" // Ajusta el ancho
                    h="40px" // Ajusta la altura para hacerlo cuadrado
                    p={0} // Quita el padding adicional
                  >
                    <EditIcon color="green.500" boxSize={6} />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteClick(contact)}
                    color="red.500"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    w="40px" // Ajusta el ancho
                    h="40px" // Ajusta la altura para hacerlo cuadrado
                    p={0} // Quita el padding adicional
                  >
                    <DeleteIcon color="red.500" boxSize={6} />
                  </Button>
                </HStack>
              </CardFooter>
            </Card>
          );
        })}
      </SimpleGrid>
      <ContactDelete
        contactName={deleteContactName}
        contact={deleteContact}
        isOpen={isOpDeleteMod}
        onClose={closeDeleteMod}
      />
    </Box>
  );
};

export default ContactsList;
