import { useEditContactMutation } from "@/features/api/contacts";
import { useUploadThing } from "@/lib/uploadthing";

import {
  Avatar,
  Button,
  Center,
  Divider,
  FormLabel,
  FormControl,
  Input,
  Text,
  useToast,
  VStack,
  Select,
  SimpleGrid,
  Image,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const UpdateContactForm = ({ contact }) => {
  const [imageKey, setImageKey] = useState("");

  const [formContact, setFormContact] = useState(
    contact || {
      address: {},
      socials: {},
    },
  );
  const [editContact, { isLoading }] = useEditContactMutation();
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const fileInputRef = useRef(null);

  const statusOptions = ["Sr.", "Sra.", "Srta."];
  const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ'´ ]+$/;

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    skipPolling: true,
    onClientUploadComplete: (res) => {
      setFormContact((prev) => ({ ...prev, logo: res[0].url }));
      setTimeout(() => setImageKey(Date.now()), 2000);
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

  useEffect(() => {
    setFormContact(contact);
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormContact((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else if (name.startsWith("socials.")) {
      const socialsField = name.split(".")[1];
      setFormContact((prev) => ({
        ...prev,
        socials: {
          ...prev.socials,
          [socialsField]: value,
        },
      }));
    } else {
      setFormContact((prev) => ({ ...prev, [name]: value }));
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await editContact({
        id: contact._id,
        contact: formContact,
      }).unwrap();

      toast({
        title: "Contacto actualizado.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error al actualizar contacto.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const [birthday, setBirthday] = useState(null);

  const handleDateChange = (date) => {
    setBirthday(date);
    if (!isNaN(Date.parse(date))) {
      const formattedDate = format(date, 'dd/MM/yyyy');
      setFormContact((prevContact) => ({
        ...prevContact,
        birthday: formattedDate,
      }));
    } else {
      console.error("Valor inválido para fecha:", date);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Foto</FormLabel>
          <Image as={Avatar} src={formContact.logo} key={imageKey} />
          <Button
            variant="outline"
            onClick={() => {
              fileInputRef.current.click();
            }}
            marginLeft={5}>
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

        <VStack spacing={4}>
          <SimpleGrid columns={2} spacing={4} w="full">
            <FormControl isRequired isInvalid={errors.firstName}>
              <FormLabel>Nombres</FormLabel>
              <Input name="firstName" value={formContact.firstName} onChange={handleChange} />
              {errors.firstName && <Text color="red.500">{errors.firstName}</Text>}
            </FormControl>
            
            <FormControl isRequired isInvalid={errors.lastName}>
              <FormLabel>Apellidos</FormLabel>
              <Input name="lastName" value={formContact.lastName} onChange={handleChange} />
              {errors.lastName && <Text color="red.500">{errors.lastName}</Text>}
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input name="email" value={formContact.email} onChange={handleChange} placeholder="Opcional"/>
              {errors.email && <Text color="red.500">{errors.email}</Text>}
            </FormControl>

            <FormControl isRequired isInvalid={errors.phone}>
              <FormLabel>Teléfono</FormLabel>
              <Input name="phone" value={formContact.phone} onChange={handleChange} />
              {errors.phone && <Text color="red.500">{errors.phone}</Text>}
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input name="description" value={formContact.description} onChange={handleChange} placeholder="Opcional" />
              {errors.description && <Text color="red.500">{errors.description}</Text>}
            </FormControl>

            <FormControl isInvalid={errors.birthday} isRequired>
              <FormLabel >Fecha de Cumpleaños</FormLabel>
              <Input
                locale={es}
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
                value={formContact.address ? formContact.address.Street : ""}
                name="address.Street"
                onChange={handleChange}
              />
              {errors["address.Street"] && (
                <Text color="red.500">{errors["address.Street"]}</Text>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Redes Sociales</FormLabel>
              <Input value={formContact.socials ? formContact.socials.X : ""} name="socials.X" placeholder="Opcional: X link" onChange={handleChange} marginBottom={3} />
              <Input value={formContact.socials ? formContact.socials.LinkedIn : ""}  name="socials.LinkedIn" placeholder="Opcional: LinkedIn link" onChange={handleChange} marginBottom={3}/>
              <Input value={formContact.socials ? formContact.socials.Facebook : ""} name="socials.Facebook" placeholder="Opcional: Facebook link" onChange={handleChange} marginBottom={0}/>
              {errors.socials && <Text color="red.500">{errors.socials}</Text>}
            </FormControl>
          </SimpleGrid>
        </VStack>
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

export default UpdateContactForm;
