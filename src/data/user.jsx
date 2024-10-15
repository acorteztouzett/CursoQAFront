import { z } from "zod";

export const userSchema = z.object({
    firstName: z.string().trim().min(2, "Nombres requeridos.").transform((val) => val.replace(/^./, (match) => match.toUpperCase())),
    lastName: z.string().trim().min(2, "Apellidos requeridos.").transform((val) => val.replace(/^./, (match) => match.toUpperCase())),
    email: z.string().email("Email invalido."),
    password: z.string().min(1, "Contraseña es requerida.").min(8, "Contraseña no segura.")
  });
  