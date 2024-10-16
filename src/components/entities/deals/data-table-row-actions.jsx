import { DotsVerticalIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDeleteDealMutation } from "@/features/api/deals";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { focusDealById, toggleDealDrawer } from "@/features/deals/slice";

export function DataTableRowActions({ row }) {
  // const deal = dealSchema.parse(row.original);
  const deal = row.original;
  const dispatch = useDispatch();
  const [deleteDeal, { isLoading: pendingDelete }] = useDeleteDealMutation();

  const handleClickDelete = async () => {
    if (!pendingDelete) {
      try {
        await deleteDeal(row.original._id).unwrap();
        dispatch(focusDealById(null));
        toast.success(`La tarea ${row.original.id} fue borrada con éxito.`);
      } catch (err) {
        console.error(err);
        toast.error(`Error al borrar.`);
      }
    }
  };

  const handleClickView = () => {
    dispatch(focusDealById(deal));
    dispatch(toggleDealDrawer());
  };
  const handleClickEdit = () => {
    dispatch(focusDealById(deal));
    dispatch(toggleDealDrawer());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex justify-center h-8 w-max p-0 data-[state=open]:bg-muted">
          <DotsVerticalIcon className="h-4 w-4" />
          <span className="sr-only">Abrir Menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={(e) => e.stopPropagation()}
            onSelect={handleClickView}>
            Ver
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => e.stopPropagation()}
            onSelect={handleClickEdit}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => e.stopPropagation()}
            onSelect={handleClickDelete}
            className="focus:text-red-500">
            Borrar
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
