import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

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

import { NotebookTabs } from "lucide-react";
import { useLoginMutation } from "@/features/api/auth";
import { userHasAuthenticated } from "@/features/auth/slice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Please provide a valid email.").trim(),
  password: z.string().min(8, "Password should at least 8 chars."),
});

export default function LogInPage() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const dispatch = useDispatch();
  const [login, { isLoading, error: err }] = useLoginMutation();
  const onSubmit = async (data) => {
    // went the long road, in order to access the error immediatly.
    // You have to chain `unwrap()`
    await login(data)
      .then((response) => {
        if (response.data) dispatch(userHasAuthenticated(response.data.user));
        if (response.error && response.error.originalStatus !== 401) {
          throw "Login failed. Contacta con el administrador :(";
        }
      })
      .catch((err) => {
        console.error(err);
        console.log(err.message);
        toast.error("Login failed. Contacta con el administrador :(");
      });
  };

  return (
    <div className="container relative h-screen w-screen mx-0 grid items-center justify-center max-w-none lg:grid-cols-[1fr_1fr_1fr] lg:px-0 bg-gradient-to-l from-lime-30 to-stone-500">
      <div className="relative hidden h-full flex-col self-start bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0" />
        <div className="relative z-20 flex items-center text-lg font-medium gap-2">
          <NotebookTabs />
          GetLavado CRM
        </div>

        
      </div>

      <Card className="max-w-sm mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Ingresa tu correo para acceder a la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="m@example.com"
                    autoComplete="current-email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Contraseña</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs">{errors.password.message}</p>
                  )}
                  {err && err.originalStatus === 401 && (
                    <p className="text-red-500 text-xs">Credenciales incorrectas.</p>
                  )}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting || isLoading ? <Spinner /> : "Iniciar sesión"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <Link to="/signup" className="underline">
                Regístrate aquí
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
