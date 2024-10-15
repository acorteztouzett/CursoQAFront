import React, { useState } from "react";
import { useCreateContactMutation } from "@/features/api/contacts";
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
  Box,
} from "@chakra-ui/react";
import { useUploadThing } from "@/lib/uploadthing";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateContactForm = ({ isOpen, onClose }) => {
  const [imageKey, setImageKey] = useState("");

  const [createContact, { isLoading }] = useCreateContactMutation();
  const [formContact, setFormContact] = useState({});
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const statusOptions = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."];
  const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ'´ ]+$/;

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    skipPolling: true,
    onClientUploadComplete: (res) => {
      setFormContact((prev) => ({ ...prev, logo: res[0].url }));

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
      setFormContact((prev) => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: value },
      }));
    } else {
      setFormContact((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStatusChange = (event) => {
    setSelectedSalutation(event.target.value);
  };

  const validate = () => {
    const newErrors = {};
    if (!formContact.firstName) {
      newErrors.firstName = "Se requiere un nombre";
    } else if (!namePattern.test(formContact.firstName)) {
      newErrors.firstName = "El nombre solo puede contener letras, tildes y apóstrofos";
    }
    if (!formContact.lastName) {
      newErrors.lastName = "Se requiere un apellido";
    } else if (!namePattern.test(formContact.lastName)) {
      newErrors.lastName = "El apellido solo puede contener letras, tildes y apóstrofos";
    }

    // Validación para el cumpleaños
    if (!formContact.birthday) {
      newErrors.birthday = "Se requiere una fecha de cumpleaños";
    }

    if (!formContact.phone) {
      newErrors.phone = "Se requiere un número de teléfono";
    } else if (!/^\+?(\d{1,4})?[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/.test(formContact.phone)) {
      newErrors.phone = "Por favor ingresa un número de teléfono válido (solo números, entre 9 y 15 dígitos)";
    }
    
    if (!formContact.salutation) newErrors.salutation = "Se requiere un prefijo de saludo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [selectedSalutation, setSelectedSalutation] = useState("Shut Down");

  const handleSubmit = async (e) => {
    e.preventDefault();
    formContact.birthday = birthday;
    //console.log(formContact.birthday);
    
    if (!validate()) return;
    try {
      const response = await createContact({
        ...formContact,
      }).unwrap();
      toast({
        title: "Contacto creado.",
        description: "El contacto se creó con éxito.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      console.log(response);
      setErrors({});
      setFormContact({});
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
        console.log(err);
      }
    }
  };

  const [birthday, setBirthday] = useState(null);

  const handleDateChange = (date) => {
    setBirthday(date);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="80%" w="70%">
        <ModalHeader>Crear Nuevo Contacto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl marginTop={-2}>
              <FormLabel>Foto</FormLabel>
              <Image as={Avatar} src={formContact.logo} key={imageKey} />
              <Button
                variant="outline"
                onClick={() => {
                  document.getElementById("logo").click();
                }}
                marginLeft={5}>
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
            <VStack spacing={4} marginTop={5}>
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isInvalid={errors.firstName} isRequired>
                  <FormLabel>Nombres</FormLabel>
                  <Input name="firstName" onChange={handleChange} />
                  {errors.firstName && <Text color="red.500">{errors.firstName}</Text>}
                </FormControl>
                <FormControl isInvalid={errors.lastName} isRequired>
                  <FormLabel>Apellidos</FormLabel>
                  <Input name="lastName" onChange={handleChange} />
                  {errors.lastName && <Text color="red.500">{errors.lastName}</Text>}
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input name="email" onChange={handleChange} placeholder="Opcional" />
                  {errors.email && <Text color="red.500">{errors.email}</Text>}
                </FormControl>
                <FormControl isInvalid={errors.phone} isRequired>
                  <FormLabel>Teléfono</FormLabel>
                  <Input name="phone" onChange={handleChange} />
                  {errors.phone && <Text color="red.500">{errors.phone}</Text>}
                </FormControl>
                <FormControl>
                  <FormLabel>Descripción</FormLabel>
                  <Input name="description" onChange={handleChange} placeholder="Opcional" />
                  {errors.description && (<Text color="red.500">{errors.description}</Text>)}
                </FormControl>

                <FormControl isInvalid={errors.birthday} isRequired>
                  <FormLabel >Fecha de Cumpleaños</FormLabel>
                  <Input
                    as={DatePicker}
                    name="birthday"
                    selected={birthday}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Seleccionar fecha"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                  />
                  {errors.birthday && <Text color="red.500">{errors.birthday}</Text>}
                </FormControl>

                <FormControl isInvalid={errors.salutation} isRequired>
                  <FormLabel>Prefijo de Saludos</FormLabel>
                  <Select
                    name="salutation"
                    value={formContact.salutation}
                    onChange={(e) => setFormContact({ ...formContact, salutation: e.target.value })}
                    placeholder="Seleccionar Status">
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                  {errors.salutation && <Text color="red.500">{errors.salutation}</Text>}
                </FormControl>

                <FormControl>
                  <FormLabel> Dirección</FormLabel>
                  <Input
                    placeholder="Calle, Avenida, Jirón, etc."
                    name="address.Street"
                    onChange={handleChange}
                  />
                  {errors["address.Street"] && (
                    <Text color="red.500">{errors["address.Street"]}</Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Redes Sociales</FormLabel>
                  <Input name="socials.X" placeholder="Opcional: X link" onChange={handleChange} marginBottom={3} />
                  <Input name="socials.LinkedIn" placeholder="Opcional: LinkedIn link" onChange={handleChange} marginBottom={3}/>
                  <Input name="socials.Facebook" placeholder="Opcional: Facebook link" onChange={handleChange} marginBottom={0}/>
                  {errors.socials && <Text color="red.500">{errors.socials}</Text>}
                </FormControl>
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
            Crear
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateContactForm;
