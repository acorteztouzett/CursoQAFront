import { useEditCompanyMutation } from "@/features/api/companies";
import { useUploadThing } from "@/lib/uploadthing";
import {
  Avatar,
  Button,
  FormLabel,
  FormControl,
  Input,
  Text,
  Divider,
  useToast,
  VStack,
  SimpleGrid,
  Image,
  Spinner,
  Select,
  Center,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";

const CompanyForm = ({ company }) => {
  const [imageKey, setImageKey] = useState("");

  const [formCompany, setFormCompany] = useState(
    company || {
      billingAddress: {
        Street: "",
        City: "",
        State: "",
        BillingCode: "",
        PostalCode: "",
      },
      shippingAddress: {
        Street: "",
        City: "",
        ShippingCode: "",
        PostalCode: "",
      },
    },
  );
  const [editCompany, { isLoading }] = useEditCompanyMutation();
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const fileInputRef = useRef(null);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    skipPolling: true,
    onClientUploadComplete: (res) => {
      setFormCompany((prev) => ({ ...prev, logo: res[0].url }));
      setTimeout(() => setImageKey(Date.now()), 2000);
    },
    onUploadError: (error) => {
      console.error(error);
      toast({
        title: "Ocurrió un error al actualizar.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  // Synchroniser l'état local avec les props entrantes
  useEffect(() => {
    setFormCompany(
      company || {
        billingAddress: {
          Street: "",
          City: "",
          State: "",
          BillingCode: "",
          PostalCode: "",
        },
        shippingAddress: {
          Street: "",
          City: "",
          ShippingCode: "",
          PostalCode: "",
        },
      },
    );
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("billingAddress.")) {
      // Divise le nom du champ pour obtenir le champ spécifique de l'adresse
      const addressField = name.split(".")[1];
      // Met à jour l'adresse avec la nouvelle valeur pour le champ spécifique
      setFormCompany((prev) => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value,
        },
      }));
    } else if (name.startsWith("shippingAddress.")) {
      const addressField = name.split(".")[1];
      setFormCompany((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [addressField]: value,
        },
      }));
    } else {
      setFormCompany((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "website" && !value.includes("https://")) {
      setFormCompany((prev) => ({
        ...prev,
        website: `https://${value}`,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formCompany.name) newErrors.name = "Se requiere el nombre de la empresa";
    if (!formCompany.description) newErrors.description = "Se requiere una descripción";
    if (!formCompany.website) newErrors.website = "Se requiere una web";
    if (!formCompany.companyType) newErrors.companyType = "Se requiere un tipo de empresa";
    if (!formCompany.industry) newErrors.industry = "Se requiere una industria";
    if (!formCompany.employees || formCompany.employees < 1)
      newErrors.employees = "El número de empleados debe ser al menos 1";
    if (!formCompany.annualRevenue || formCompany.annualRevenue < 1000)
      newErrors.annualRevenue = "Los ingresos anuales deben ser al menos $1000";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await editCompany({
        id: company._id,
        company: formCompany,
      }).unwrap();
      toast({
        title: "Empresa actualizada.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Ocurrió un error al actualizar.",
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
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Foto</FormLabel>
          <Image as={Avatar} src={formCompany.logo} key={imageKey} marginRight={2}/>
          <Button
            variant="outline"
            onClick={() => {
              fileInputRef.current.click();
            }}>
            {isUploading ? <Spinner /> : "Cambiar foto"}
          </Button>{" "}
          <Input
            hidden
            name="logo"
            type="file"
            id="logo"
            ref={fileInputRef}
            onChange={(event) => {
              startUpload([event.target.files[0]]);
            }}
          />
        </FormControl>

        <SimpleGrid columns={2} spacing={4} w="full">
          <FormControl isRequired isInvalid={errors.name}>
            <FormLabel>Nombre de la Empresa</FormLabel>
            <Input name="name" value={formCompany.name} onChange={handleChange} />
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
            <Input name="description" value={formCompany.description} onChange={handleChange}/>
            {errors.description && (
              <Text color="red.500">{errors.description}</Text>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>Sitio Web</FormLabel>
            <Input name="website" type="" value={formCompany.website} onChange={handleChange} placeholder="Opcional"/>
            {errors.website && <Text color="red.500">{errors.website}</Text>}
          </FormControl>

          <FormControl>
            <FormLabel>Símbolo Ticker</FormLabel>
            <Input name="tickerSymbol" value={formCompany.tickerSymbol} onChange={handleChange} placeholder="Opcional"/>
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

          <FormControl isRequired isInvalid={errors.annualRevenue}>
            <FormLabel>$ Ingresos Anuales</FormLabel>
            <Input
              type="number"
              name="annualRevenue"
              value={formCompany.annualRevenue}
              onChange={handleChange}
            />
            {errors.annualRevenue && <Text color="red.500">{errors.annualRevenue}</Text>}
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
        </SimpleGrid>
      </VStack>
      <Center>
          <Divider marginTop="2%"></Divider>
        </Center>
      <Center>
        <Button bg="black" color="white" type="submit" isLoading={isLoading} w="10%" marginTop="2%">
          Guardar
        </Button>
      </Center>
    </form>
  );
};

export default CompanyForm;
