import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  HStack,
  Heading,
  Image,
  Avatar,
  Spinner,
  Stack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { SocialIcon } from "react-social-icons";
import { useParams } from "react-router-dom";
import UpdateContactForm from "./UpdateContactForm";
import { useGetContactByIdQuery } from "@/features/api/contacts";
import { useGetUserByIdQuery } from "@/features/api/user";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ContactDetails = ({ isSidebarOpen }) => {
  const { contactId } = useParams();
  const { data: contact, error, isLoading } = useGetContactByIdQuery(contactId);

  const [createdByUser, setCreatedByUser] = useState(null);
  const [modifiedByUser, setModifiedByUser] = useState(null);

  const { data: createdByData } = useGetUserByIdQuery(contact?.createdBy, {
    skip: !contact?.createdBy,
  });
  const { data: modifiedByData } = useGetUserByIdQuery(contact?.lastModifiedBy, {
    skip: !contact?.lastModifiedBy,
  });

  useEffect(() => {
    if (createdByData) {
      setCreatedByUser(createdByData);
    }
  }, [createdByData]);

  useEffect(() => {
    if (modifiedByData) {
      setModifiedByUser(modifiedByData);
    }
  }, [modifiedByData]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Text>Error: {error.message}</Text>
      </Box>
    );
  }

  if (!contact) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Heading>No se encontró el contacto : {contactId}</Heading>
      </Box>
    );
  }

  return (
    <Box
      ml={isSidebarOpen ? "250px" : "70px"} // Ajusta el margen dependiendo del sidebar
      transition="margin-left 0.3s ease"  // Transición suave al abrir/cerrar el sidebar
      p={4}  // Padding interno para darle espacio alrededor
    >
      <Heading mb={4} textAlign="center">
        <Text>
          {contact.firstName} {contact.lastName}
        </Text>
      </Heading>

      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList>
          <Tab>General</Tab>
          <Tab>Editar</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Card maxW="lg" mx="auto">
              <CardHeader>
                <HStack justify="space-between">
                  <Box fontSize="xs" fontWeight="medium">
                    Creador por:{" "}
                    {createdByUser ? (
                      <Text color="blue">
                        {" "}
                        {createdByUser.firstName} {createdByUser.lastName}
                      </Text>
                    ) : (
                      "Nadie"
                    )}
                  </Box>
                  <Box fontSize="xs" fontWeight="medium">
                    Última actualización por:{" "}
                    {modifiedByUser ? (
                      <Text color="blue">
                        {" "}
                        {modifiedByUser.firstName} {modifiedByUser.lastName}
                      </Text>
                    ) : (
                      "Nadie"
                    )}
                  </Box>
                </HStack>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  <HStack>
                    <Image
                      as={Avatar}
                      src={contact.logo}
                      alt="Contact Logo"
                      boxSize="50px"
                    />
                    <Text fontWeight="bold" p={2} alignContent="end">
                      {contact.salutation} {contact.firstName} {contact.lastName}
                    </Text>
                  </HStack>
                  <Text>Email: {contact.email}</Text>
                  <Divider />
                  <Text>Descripción: {contact.description}</Text>
                  <Divider />

                <HStack>
                  <Box bg="green.400" borderRadius="50px" p={2}></Box>
                  <Heading fontSize="lg">Redes Sociales</Heading>
                </HStack>
                <Center>
                  <HStack spacing={2} mt={0}>
                    <Box>
                      {contact.socials?.LinkedIn && (
                        <SocialIcon
                          url={contact.socials.LinkedIn}
                          style={{ width: "40px", height: "40px", marginRight: "15px"}}
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

                  <Divider />

                  <HStack>
                    <Box bg="blue.400" borderRadius="50px" p={2}></Box>
                    <Heading fontSize="lg">Número de Teléfono</Heading>
                  </HStack>
                  <Text textAlign="center">{contact.phone}</Text>
                  <Divider />
                  <HStack>
                    <Box bg="red.400" borderRadius="50px" p={2}></Box>
                    <Heading fontSize="lg">Fecha de Cumpleaños</Heading>
                  </HStack>
                  <Text textAlign="center">
                      {contact.birthday ? contact.birthday : "No se guardó fecha de nacimiento."}
                  </Text>
                  <Divider />
                  <HStack>
                    <Box bg="yellow.400" borderRadius="50px" p={2}></Box>
                    <Heading fontSize="lg">Dirección</Heading>
                  </HStack>
                  <Text textAlign="center">
                    {contact.address ? contact.address.street : 'Aun no se ingresa una dirección.' }
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          </TabPanel>
          <TabPanel>
            <UpdateContactForm contact={contact} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ContactDetails;
