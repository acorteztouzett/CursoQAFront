import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { profileFormSchema } from "@/data/profile";
import { useEditUserMutation } from "@/features/api/user";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, Card } from "@/components/ui/card";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useUploadThing } from "@/lib/uploadthing";
import { Spinner } from "../ui/spinner";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

export function ProfileForm() {
  const user = useOutletContext()
  const [editUser, { isLoading }] = useEditUserMutation();
  const [imageKey, setImageKey] = useState("");
  
  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      avatar: user?.avatar || "",
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
      phone: user?.phone,
      bio: user?.bio || "",
    },
    mode: "onChange",
  });

  const { fields, append } = useFieldArray({
    name: "urls",
    control: form.control,
  });

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    skipPolling: true,
    onClientUploadComplete: (res) => {
      form.setValue("avatar", res[0].url, { shouldValidate: true });
      setTimeout(() => setImageKey(Date.now()), 1500); // 👀
    },
    onUploadError: (error) => {
      console.error(error);
      toast.error("Error occurred while uploading");
    },
  });

  async function onSubmit(data) {
    try {
      await editUser({ id: user._id, data }).unwrap();
      toast.info("Profile updated! 👌");
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Couldn't update profile, please try again");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col w-auto min-h-screen">
          <div className="grid gap-6">
            <Card className="bg-white dark:bg-gray-950 rounded-none border-none shadow-none">
              <CardContent className="space-y-4 p-0">
                <div className="flex items-center gap-4">
                  <FormField
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Avatar className="h-20 w-20">
                            <AvatarImage alt="avatar" src={field.value} key={imageKey} />
                            <AvatarFallback className="bg-lime-20 text-neutral-500 font-medium">
                              {`${user?.firstName[0]} ${user?.lastName[0]}`}
                            </AvatarFallback>
                          </Avatar>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-2">
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        className="text-neutral-90 dark:hover:bg-lime-900 w-max"
                        onClick={() => {
                          
                          document.getElementById("avatar").click();
                        }}>
                        {isUploading ? <Spinner /> : "Editar Avatar"}
                      </Button>
                      <Input
                        hidden
                        type="file"
                        id="avatar"
                        onChange={(event) => {
                          startUpload([event.target.files[0]]);
                        }}
                      />
                    </div>
                    <p className="text-[0.8rem] text-neutral-500 dark:text-neutral-400">
                      Actualizar imagen de perfil (4MB max..).
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombres</FormLabel>
                          <FormControl>
                            <Input
                              id="firstName"
                              value={field.value}
                              placeholder="John"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellidos</FormLabel>
                          <FormControl>
                            <Input
                              id="lastName"
                              value={field.value}
                              placeholder="Dough"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl
                        >
                          <Textarea
                            placeholder="Escribe algo sobre ti"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apodo</FormLabel>
                        <FormControl isRequired>
                          <Input placeholder="Mi apodo" value={field.value} {...field} />
                        </FormControl>
                        <FormDescription>
                          Escribe tu apodo
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    className="disabled:text-neutral-900 font-medium"
                    disabled
                    value={user?.email}
                    type="email"
                  />
                  <p className="text-[0.8rem] text-neutral-500">
                    No puedes editar tu email
                  </p>
                </div>
                <div className="space-y-2">
                  <FormField
                    name="phone"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Celular</FormLabel>
                        <FormControl>
                          <Input
                            id="phone"
                            placeholder="999333111"
                            value={field.value}
                            {...field}
                          />
                        </FormControl>
                        
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <FormField
                      control={form.control}
                      key={field.id}
                      name={`urls.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
              
                          <FormControl>
                            <Input
                              placeholder={`snaz${index}@domain.ma`}
                              value={field.value}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" variant="default">
                  {isLoading ? <Spinner /> : "Actualizar perfil"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
