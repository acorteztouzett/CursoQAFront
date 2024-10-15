import { useDeleteCompanyMutation } from "@/features/api/companies";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";

function CompanyDelete({ isOpen, onClose, company, companyName }) {
  const [deleteCompany, { isLoading }] = useDeleteCompanyMutation();
  const toast = useToast();

  useEffect(() => {}, [isOpen, companyName]);

  const handleDelete = async () => {
    try {
      await deleteCompany(company).unwrap();
      toast({
        title: `${companyName} deleted`,
        description: "Se eliminó correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose(); // Ferme le modal après suppression
    } catch (err) {
      console.error(err);
      toast({
        title: "Ocurrió un error.",
        description: "Error al eliminar.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Eliminar compañia</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          ¿Está seguro(a) que quieres eliminar a la empresa: <strong> {companyName}</strong>?
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleDelete}
            variant="ghost"
            colorScheme="red"
            isLoading={isLoading}>
            Eliminar
          </Button>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CompanyDelete;
