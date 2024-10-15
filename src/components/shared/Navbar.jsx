import {
  Flex,
  Box,
  Input,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AvatarBadge,
  Text
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  SearchIcon,
  BellIcon,
  EmailIcon,
  InfoOutlineIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "@/features/api/auth";
import { LogOutIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { userHasLoggedOut } from "@/features/auth/slice";

const Navbar = ({ isSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const [logout] = useLogoutMutation()
  const dispatch = useDispatch()

  async function handleLogout() {
    try {
      await logout().unwrap();
      dispatch(userHasLoggedOut());
      window.location.reload();
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <Flex
      align="center"
      justify="space-between"
      wrap="wrap"
      px={4}
      py={3}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      >
      {/*<Flex alignItems="center">
        <Box display={{ base: "none", md: "block" }} mr={4}>
          <IconButton
            ml={40}
            aria-label="Buscar"
            icon={<SearchIcon />}
            colorScheme="gray"
            borderRadius="50%"
            bg="transparent"
            _hover={{ bg: "gray.100" }}
          />
        </Box>
        <Input
          placeholder="Buscando..."
          bg="gray.100"
          color="black"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          width={{ base: "full", md: "250px" }}
          _hover={{ borderColor: "gray.300" }}
          _focus={{ borderColor: "blue.400" }}
        />
      </Flex>*/}


      <Flex alignItems="center" ml="87%">
        <Menu >
          <Text width="150px" fontSize={16} display="inline-flex">{user?.firstName} {user?.lastName}</Text>
          <MenuButton
            as={Avatar}
            bg="black"
            color="white"
            p={6}
            src={user?.avatar}
            name={`${user?.firstName ?? "Unknown"} ${user?.lastName ?? "User"}`}
            boxSize="60px"
            aria-label="Options"
            variant="outline">
            <AvatarBadge boxSize="0.9em" bg="green.500" />
          </MenuButton>
          <MenuList>
            <MenuItem
              as={RouterLink}
              to="/me"
              icon={<EditIcon boxSize={6}/>}
            >
              Editar Perfil
            </MenuItem>
            <MenuItem 
              icon={<LogOutIcon />}
              onClick={handleLogout}
            >Cerrar Sesion</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Navbar;
