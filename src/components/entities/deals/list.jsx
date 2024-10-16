// import { z } from "zod"

import { useGetDealsListQuery } from "@/features/api/deals";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { toast } from "sonner";
import LoadingSkeleton from "../skeleton";

export default function DealList() {
  const { data: deals, error, isLoading } = useGetDealsListQuery();

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    console.error(error);
    toast.error("No se cargaron los clientes 🤕")
  }
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-6 pt-3 mx-auto md:flex">
      <DataTable data={deals} columns={columns} />
    </div>
  );
}
