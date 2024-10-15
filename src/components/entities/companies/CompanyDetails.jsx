import {
  Box,
  Card,
  CardBody,
  Center,
  Divider,
  Grid,
  GridItem,
  HStack,
  Heading,
  Spinner,
  Stack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
  Avatar,
} from "@chakra-ui/react";
import { FaRegBuilding, FaDollarSign } from "react-icons/fa";
import { LiaUsersSolid } from "react-icons/lia";
import { IoStorefront, IoBarcode } from "react-icons/io5";
import { useParams } from "react-router-dom";
import CompanyForm from "./CompanyForm";
import { useGetCompanyByIdQuery } from "@/features/api/companies";

const CompanyDetails = ({ isSidebarOpen }) => {
  const { companyId } = useParams();
  const { data: company, error, isLoading } = useGetCompanyByIdQuery(companyId);

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

  if (!company) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Heading>No se encontró compañia con el ID: {companyId}</Heading>
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
        {company.name}
      </Heading>

      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList>
          <Tab>General</Tab>
          <Tab>Editar</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Grid
              templateRows={{ base: "repeat(4, 1fr)", md: "repeat(1, 1fr)" }}
              templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
              gap={4}
              mt={4}>
              <GridItem>
                <Card p={2} maxW="sm" mx="auto">
                  <CardBody>
                    <Stack spacing={3}>
                      <Heading display="contents" size="md">
                        <Center>
                          <Box borderRadius="10px" p={2}>
                            {company.logo ? (
                              <Image
                                as={Avatar}
                                src={company.logo}
                                alt="Company Logo"
                                boxSize="50px"
                              />
                            ) : (
                              <FaRegBuilding color="rgba(54, 162, 235, 0.54)" size="50px" />
                            )}
                          </Box>

                          <Text ml={4} mt={2}>
                            {company.name}
                          </Text>
                        </Center>
                      </Heading>
                      <Text>Tipo de empresa: {company.companyType}</Text>
                      <Text>Sitio Web: <Text color="blue.500" display="inline-flex"><a href={company.website}><strong>{company.website}</strong></a></Text></Text>
                      <Divider />
                      <Center><Text color="gray.500" fontWeight={600}>Descripción</Text></Center>
                      <Text color="Black.1000">{company.description}</Text>
                    </Stack>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <Card mx="auto">
                  <CardBody>
                    <Center>
                      <Stack>
                        <HStack>
                          <Box m={2} bg="blue.400" borderRadius="50px" p={2}>
                            <FaDollarSign color="white" size={40} />
                          </Box>
                          <Heading fontSize="lg">Ingresos anuales</Heading>
                        </HStack>
                        <Divider />
                        <Text textAlign="center">
                          {company.annualRevenue?.toLocaleString('en-US').replace(/,/g, ' ')}
                        </Text>
                      </Stack>
                    </Center>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <Card mx="auto">
                  <CardBody>
                    <Center>
                      <Stack>
                        <HStack>
                          <Box m={2} bg="red.400" borderRadius="50px" p={2}>
                            <LiaUsersSolid color="white" size={40} />
                          </Box>
                          <Heading fontSize="lg">Empleados</Heading>
                        </HStack>
                        <Divider />
                        <Text textAlign="center">{company.employees}</Text>
                      </Stack>
                    </Center>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <Card mx="auto">
                  <CardBody>
                    <Center>
                      <Stack align="center">
                        <HStack>
                          <Box m={2} bg="yellow.400" borderRadius="50px" p={2}>
                            <IoStorefront color="white" size={40} />
                          </Box>
                          <Heading fontSize="lg" textAlign="center">Dirección</Heading>
                        </HStack>
                        <Divider />
                        <Text textAlign="center">
                          {company.billingAddress?.Street ? company.billingAddress.Street : "Aún no se registró una dirección."}
                        </Text>
                      </Stack>
                    </Center>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <Card mx="auto">
                  <CardBody>
                    <Center>
                      <Stack align="center">
                        <HStack>
                          <Box m={2} bg="green.400" borderRadius="50px" p={2}>
                            <IoBarcode color="white" size={40} />
                          </Box>
                          <Heading fontSize="lg" textAlign="center">Símbolo Ticker</Heading>
                        </HStack>
                        <Divider />
                        <Text textAlign="center">
                          {company.tickerSymbol ? company.tickerSymbol : "Aún no se registró un símbolo ticker."}
                        </Text>
                      </Stack>
                    </Center>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </TabPanel>
          <TabPanel>
            <CompanyForm company={company} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CompanyDetails;
