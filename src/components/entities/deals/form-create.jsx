import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dealSchema, { assignees, stages } from "@/data/deals"; // Asegúrate de definir el esquema adecuado
import { useDispatch } from "react-redux";
import { useAddDealMutation } from "@/features/api/deals"; // Asegúrate de tener este hook para añadir
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing"; // Hook de uploads
import { Form } from "react-router-dom";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input, Popover, PopoverTrigger } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Calendar } from "@/components/ui/calendar";
import { PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import Tiptap from "../tasks/form-tiptap-editor";
import { DealSelects } from "./form-select";
// import { Button, Input, Avatar, AvatarImage, AvatarFallback, ScrollArea, Form, FormField, FormItem, FormControl, FormMessage } from "./components";

export default function AddDealForm() {
  const form = useForm({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: "",
      stage: "",
      assignee: null,
      amount: "",
      closingDate: new Date(),
      nextStep: "",
      notes: "",
      attachements: [],
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attachements",
  });

  // Redux & mutation hooks
  const dispatch = useDispatch();
  const [addDeal, { isLoading: pendingAdd }] = useAddDealMutation();

  // File Upload hooks and state
  const { startUpload, isUploading } = useUploadThing("multiUploader", {
    skipPolling: true,
    onClientUploadComplete: (res) => {
      append(
        { name: res[0].name, size: res[0].size, type: res[0].type, url: res[0].url },
        { shouldValidate: true }
      );
    },
    onUploadError: (error) => {
      console.error(error);
      toast.error("Error occurred while uploading");
    },
  });

  async function onSubmit(data) {
    if (!pendingAdd) {
      try {
        await addDeal(data).unwrap();
        dispatch(toggleDealDrawer()); // Cierra el formulario
        toast.success("Deal added successfully! ✔️");
      } catch (err) {
        console.error(err);
        toast.error("Failed to add deal.");
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-[980px] ml-auto bg-white p-6 md:p-8 lg:p-10 flex flex-col gap-6 rounded-l-xl">
          <div className="flex items-center justify-between">
            <div className="w-[800px]">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Deal Title"
                        className="text-xl font-semibold border-none py-0 px-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center gap-4">
              <Button type="submit" variant="outline" size="icon">
                <Check className="h-5 w-5 text-green-500" />
                <span className="sr-only">Confirm</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="stage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DealSelects
                      value={field.value}
                      onChange={field.onChange}
                      options={stages} // Asegúrate de definir las etapas adecuadas
                      placeholder="Select Stage"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Deal Amount"
                      className="text-[1.2rem] font-semibold border-none py-0 px-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="closingDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-max">
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={{ before: new Date() }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ScrollArea className="bg-neutral-10 rounded-md border">
                    <div className="p-3 rounded-lg h-48">
                      <Tiptap
                        data-vaul-no-drag
                        description={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                  </ScrollArea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3">
            <h2 className="text-s font-medium text-zinc-500">Files</h2>
            <section className="flex gap-2 items-center flex-wrap whitespace-normal">
              {fields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`attachements.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => window.open(field.value.url, "_blank")}
                        >
                          {field.value.name}
                        </Button>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Input
                hidden
                type="file"
                id="attachements"
                onChange={(event) => {
                  startUpload([event.target.files[0]]);
                }}
              />
              <Button
                variant="outline"
                type="button"
                onClick={() => document.getElementById("attachements").click()}
              >
                {isUploading ? <Spinner size="12" /> : <Plus size="16" />}
              </Button>
            </section>
          </div>
        </div>
      </form>
    </Form>
  );
}