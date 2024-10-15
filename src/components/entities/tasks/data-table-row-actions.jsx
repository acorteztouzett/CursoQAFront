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

import { useDeleteTaskMutation } from "@/features/api/tasks";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { focusTaskById, toggleTaskDrawer } from "@/features/tasks/slice";

export function DataTableRowActions({ row }) {
  // const task = taskSchema.parse(row.original);
  const task = row.original;
  const dispatch = useDispatch();
  const [deleteTask, { isLoading: pendingDelete }] = useDeleteTaskMutation();

  const handleClickDelete = async () => {
    if (!pendingDelete) {
      try {
        await deleteTask(row.original._id).unwrap();
        dispatch(focusTaskById(null));
        toast.success(`La tarea ${row.original.id} fue borrada con éxito.`);
      } catch (err) {
        console.error(err);
        toast.error(`Ocurrió un fallo al borrar la tarea.`);
      }
    }
  };

  const handleClickView = () => {
    dispatch(focusTaskById(task));
    dispatch(toggleTaskDrawer());
  };
  const handleClickEdit = () => {
    dispatch(focusTaskById(task));
    dispatch(toggleTaskDrawer());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
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
