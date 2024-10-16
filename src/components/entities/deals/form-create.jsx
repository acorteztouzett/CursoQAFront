import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { schema } from "@/data/deals";
import { toggleDealDrawer } from "@/features/deals/slice";
import { useCreateDealMutation } from "@/features/api/deals";
import { useDispatch } from "react-redux";

export function DealForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      stage: "Nuevo",
      attachements: [],
    },
    mode: "onSubmit",
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "attachements",
  });

  const [createDeal, { isLoading: pendingCreation }] = useCreateDealMutation();
  const dispatch = useDispatch();

  async function onSubmit(data) {
    try {
      await createDeal(data).unwrap();
      dispatch(toggleDealDrawer());
    } catch (error) {
      console.error("Submission error", error);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="p-8 bg-white rounded-lg shadow-md max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Registrar nuevo pedido
      </h2>

      <div className="space-y-6">

        <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700">
            Titulo
          </label>
          <input
            {...form.register("title")}
            id="label"
            type="text"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Titulo del pedido"
          />
        </div>

        {/* Assignee */}
        <div>
          <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">
            Asignado a
          </label>
          <input
            {...form.register("assignee.name")}
            id="assignee"
            type="text"
            placeholder="Quien se encarga de este cliente"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Contact */}
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
            Información de contacto de cliente
          </label>
          <input
            {...form.register("contact.fullName")}
            id="contact"
            type="text"
            placeholder="Nombres"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            {...form.register("contact.email")}
            id="email"
            type="email"
            placeholder="Email"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Stage */}
        <div>
          <label htmlFor="stage" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            {...form.register("stage")}
            id="stage"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Nuevo">Nuevo</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Pagado">Pagado</option>
            <option value="Recojo">Recojo</option>
            <option value="Enviando">Enviando</option>
            <option value="Terminado">Terminado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Monto a cobrar
          </label>
          <input
            {...form.register("amount")}
            id="amount"
            type="text"
            placeholder="Monto a cobrar"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notas
          </label>
          <textarea
            {...form.register("notes")}
            id="notes"
            rows="4"
            placeholder="Añade notas adicionales"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-500"
        >
          Guardar pedido
        </button>
      </div>
    </form>
  );
}