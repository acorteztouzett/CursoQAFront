import { useState } from "react";
import { useCreateCompanyMutation } from "@/features/api/companies";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormLabel,
  FormControl,
  Input,
  VStack,
  Text,
  SimpleGrid,
  useToast,
  Select,
  Image,
  Avatar,
} from "@chakra-ui/react";
import { useUploadThing } from "@/lib/uploadthing";

import { useSelector } from "react-redux";
import { Spinner } from "@/components/ui/spinner";

const CreateCompanyForm = ({ isOpen, onClose }) => {
  const [imageKey, setImageKey] = useState("");

  const user = useSelector((state) => state.auth.user);
  const [createCompany, { isLoading }] = useCreateCompanyMutation();
  const [formCompany, setFormCompany] = useState({});
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    skipPolling: true,
    onClientUploadComplete: (res) => {
      setFormCompany((prev) => ({ ...prev, logo: res[0].url }));

      setTimeout(() => setImageKey(Date.now()), 1500);
    },
    onUploadError: (error) => {
      console.error(error);
      toast({
        title: "Error occurred while uploading",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length > 1) {
      setFormCompany((prev) => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: value },
      }));
    } else if (name === "website" && !value.includes("https://")) {
      setFormCompany((prev) => ({
        ...prev,
        website: `https://${value}`,
      }));
    } else {
      setFormCompany((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formCompany.name || formCompany.name.length < 3 ) {
      newErrors.name = "El nombre de la empresa debe tener al menos 3 caracteres";
    } 
    if (!formCompany.companyType) newErrors.companyType = "Se requiere un tipo de empresa";
    if (!formCompany.employees) newErrors.employees = "Seleccione la cantidad de empleados";
    if (!formCompany.description) newErrors.description = "Ingrese una descripción";
    if (!formCompany.annualRevenue || formCompany.annualRevenue < 1000) newErrors.annualRevenue = "El monto debe ser al menos $1000";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [selectedRating, setSelectedRating] = useState("Shut Down"); // État pour stocker la valeur sélectionnée

  // Fonction de gestion de changement de sélection
  const handleStatusChange = (event) => {
    setSelectedRating(event.target.value);
  };

  // Options disponibles
  const statusOptions = [
    "Acquired",
    "Active",
    "Market Failed",
    "Project Cancelled",
    "Shut Down",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await createCompany({
        ...formCompany,
        ownership: user.firstName,
        owner: user._id,
        rating: selectedRating,
      }).unwrap();
      toast({
        title: "Empresa creada.",
        description: "La compañía ha sido exitosamente creada",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setErrors({});
      setFormCompany({});
      onClose();
    } catch (err) {
      toast({
        title: "Ocurrió un error.",
        description: err.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      if (err.data && err.data.error) {
        if (!err.data.error.details) {
          return setErrors(err.data.message);
        }
        const validationError = err.data.error.details.reduce((acc, error) => {
          const fieldName = error.path.join(".");
          acc[fieldName] = error.message;
          return acc;
        }, {});
        setErrors(validationError);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="60%" w="70%">
        <ModalHeader>Crear Nueva Empresa</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Foto</FormLabel>
              <Image as={Avatar} src={formCompany.logo} key={imageKey} marginRight={2}/>
              <Button
                variant="outline"
                onClick={() => {
                  // Imma do the forbidden, ,-,
                  document.getElementById("logo").click();
                }}>
                {isUploading ? <Spinner /> : "Cambiar foto"}
              </Button>
              <Input
                hidden
                name="logo"
                type="file"
                id="logo"
                onChange={(event) => {
                  startUpload([event.target.files[0]]);
                }}
              />
            </FormControl>
            <VStack spacing={4}>
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isInvalid={errors.name} isRequired>
                  <FormLabel>Nombre de la Empresa</FormLabel>
                  <Input name="name" onChange={handleChange} />
                  {errors.name && <Text color="red.500">{errors.name}</Text>}
                </FormControl>
                <FormControl isInvalid={errors.companyType} isRequired>
                  <FormLabel>Tipo de Empresa</FormLabel>
                  <Select 
                    placeholder="Seleccione el tipo de empresa"
                    value={formCompany.companyType}
                    onChange={(e) => setFormCompany({ ...formCompany, companyType: e.target.value })}
                  >
                    <option value="Tienda de Lavado">Tienda de Lavado</option>
                    <option value="Agencia de Lavado">Agencia de Lavado</option>
                    <option value="Servicio de Lavado a Domicilio">Servicio de Lavado a Domicilio</option>
                    <option value="Taller de Lavandería Industrial">Taller de Lavandería Industrial</option>
                    <option value="Lavandería Autoservicio">Lavandería Autoservicio</option>
                    <option value="Lavandería Ecológica">Lavandería Ecológica</option>
                    <option value="Lavandería Express">Lavandería Express</option>
                    <option value="Centro de Lavado Comercial">Centro de Lavado Comercial</option>
                  </Select>
                  {errors.companyType && <Text color="red.500">{errors.companyType}</Text>}
                </FormControl>
                <FormControl isInvalid={errors.description} isRequired>
                  <FormLabel>Descripción</FormLabel>
                  <Input name="description" onChange={handleChange} placeholder="Opcional"/>
                  {errors.description && (
                    <Text color="red.500">{errors.description}</Text>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>Sitio Web</FormLabel>
                  <Input name="website" type="url" onChange={handleChange} placeholder="Opcional"/>
                  {errors.website && <Text color="red.500">{errors.website}</Text>}
                </FormControl>
                <FormControl>
                  <FormLabel>Símbolo Ticker</FormLabel>
                  <Input name="tickerSymbol" onChange={handleChange} placeholder="Opcional"/>
                  {errors.tickerSymbol && (
                    <Text color="red.500">{errors.tickerSymbol}</Text>
                  )}
                </FormControl>
                
                <FormControl isInvalid={errors.employees} isRequired>
                  <FormLabel>Cantidad de Empleados</FormLabel>
                  <Select 
                    placeholder="Selecciona un rango" 
                    value={formCompany.employees}
                    onChange={(e) => setFormCompany({ ...formCompany, employees: e.target.value })}
                  >
                    <option value="1-100">1-100</option>
                    <option value="101-500">101-500</option>
                    <option value="501-1000">501-1000</option>
                    <option value="Más de 1000">Más de 1000</option>
                  </Select>
                  {errors.employees && <Text color="red.500">{errors.employees}</Text>}
                </FormControl>

                <FormControl isInvalid={errors.annualRevenue} isRequired>
                  <FormLabel>$ Ingresos Anuales</FormLabel>
                  <Input type="number" name="annualRevenue" value={formCompany.annualRevenue} onChange={handleChange} placeholder="Opcional"/>
                  {errors.annualRevenue && (
                    <Text color="red.500">{errors.annualRevenue}</Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Dirección</FormLabel>
                    <Input
                      placeholder="Calle, Avenida, Jirón, etc."
                      name="billingAddress.Street"
                      onChange={handleChange}
                    />
                    {errors["billingAddress.Street"] && (
                      <Text color="red.500">{errors["billingAddress.Street"]}</Text>
                    )}
                </FormControl>
                {/*<FormControl>
                  <FormLabel>Tag</FormLabel>
                  <Input name="tag" onChange={handleChange} />
                  {errors.tag && <Text color="red.500">{errors.tag}</Text>}
                </FormControl>*/}
              </SimpleGrid>
              <SimpleGrid columns={2} spacing={4} w="full">
                {<FormControl>
                  
                  {/*<Input
                    placeholder="City"
                    name="billingAddress.City"
                    onChange={handleChange}
                    mt={2}
                  />
                  {errors["billingAddress.City"] && (
                    <Text color="red.500">{errors["billingAddress.City"]}</Text>
                  )}
                  <Input
                    placeholder="State"
                    name="billingAddress.State"
                    onChange={handleChange}
                    mt={2}
                  />
                  {errors["billingAddress.State"] && (
                    <Text color="red.500">{errors["billingAddress.State"]}</Text>
                  )}
                  <Input
                    placeholder="Billing Code"
                    name="billingAddress.BillingCode"
                    onChange={handleChange}
                    mt={2}
                  />
                  {errors["billingAddress.BillingCode"] && (
                    <Text color="red.500">{errors["billingAddress.BillingCode"]}</Text>
                  )}
                  <Input
                    placeholder="Postal Code"
                    name="billingAddress.PostalCode"
                    onChange={handleChange}
                    mt={2}
                  />
                  {errors["billingAddress.PostalCode"] && (
                    <Text color="red.500">{errors["billingAddress.PostalCode"]}</Text>
                  )}
                </FormControl>}
                {/*<FormControl>
                  <FormLabel>Shipping Address</FormLabel>
                  <Input
                    placeholder="Street"
                    name="shippingAddress.Street"
                    onChange={handleChange}
                  />
                  {errors["shippingAddress.Street"] && (
                    <Text color="red.500">{errors["shippingAddress.Street"]}</Text>
                  )}
                  <Input
                    placeholder="City"
                    name="shippingAddress.City"
                    onChange={handleChange}
                    mt={2}
                  />
                  {errors["shippingAddress.City"] && (
                    <Text color="red.500">{errors["shippingAddress.City"]}</Text>
                  )}
                  <Input
                    placeholder="Shipping Code"
                    name="shippingAddress.ShippingCode"
                    onChange={handleChange}
                    mt={2}
                  />
                  {errors["shippingAddress.ShippingCode"] && (
                    <Text color="red.500">{errors["shippingAddress.ShippingCode"]}</Text>
                  )}
                  <Input
                    placeholder="Postal Code"
                    name="shippingAddress.PostalCode"
                    onChange={handleChange}
                    mt={2}
                  />
                  {errors["shippingAddress.PostalCode"] && (
                    <Text color="red.500">{errors["shippingAddress.PostalCode"]}</Text>
                  )}*/}
                </FormControl>}
              </SimpleGrid>
              <SimpleGrid columns={2} spacing={4} w="full"></SimpleGrid>
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateCompanyForm;
