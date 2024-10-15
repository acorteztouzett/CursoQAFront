import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { userSchema } from "@/data/user";
import { useSignupMutation } from "@/features/api/auth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotebookTabs } from "lucide-react";

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SignUpPage() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();
  const onSubmit = async (data) => {
    
    try {
      await signup(data).unwrap();
      toast.info("Registrado correctamente. Inicia sesión.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      if (err.status === 409)
        setError("email", { type: 409, message: "El email ya existe" });
      toast.error("El registro falló. Contacta con el administrador :(");
    }
  };

  return (
    <div className="container relative h-screen grid items-center justify-center lg:max-w-none lg:grid-cols-[1fr_1fr_1fr] lg:px-0 bg-gradient-to-l from-lime-30 to-stone-500">
      <div className="relative hidden h-full flex-col self-start bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0" />
        <div className="relative z-20 flex items-center text-lg font-medium gap-2">
          <NotebookTabs />
          Huellipets CRM
        </div>

        
      </div>

      <Card className="mx-auto max-w-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Registrarme</CardTitle>
          <CardDescription>Ingresa tu información para registrarte</CardDescription>
        </CardHeader>
        <CardContent>
          <Form>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div
                  className={cn(
                    "grid grid-cols-2 gap-x-4",
                    errors.lastName || errors.firstName ? "grid-rows-[4fr_1fr]" : "",
                  )}>
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">Nombres</Label>
                    <Input
                      id="firstName"
                      autoComplete="current-firstname"
                      placeholder="Juan"
                      {...register("firstName")}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Apellidos</Label>
                    <Input
                      id="lastName"
                      autoComplete="current-lastname"
                      placeholder="Garcia"
                      {...register("lastName")}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs grid">
                      {errors.firstName.message}
                    </p>
                  )}
                  {errors.lastName && (
                    <p className="text-red-500 text-xs col-start-2 row-start-2">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="m@example.com" {...register("email")} />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="password"
                    placeholder="Min. 8 caracteres"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs">{errors.password.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full">
                  {isLoading ? <Spinner /> : "Crear cuenta"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="underline">
                  Ingresa aquí
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
