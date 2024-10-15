import { z } from "zod";

export const tabs = [
  {
    title: "Perfil",
    value: "profile",
    href: "/me",
    description: "Actualiza tus datos e información personal.",
  }
];

export const profileFormSchema = z.object({
  avatar: z
    .string()
    .optional()
    .transform((val) => (val ? val : undefined)),
  firstName: z
    .string()
    .trim()
    .transform((val) => val.replace(/^./, (match) => match.toUpperCase()))
    .optional(),
  lastName: z
    .string()
    .trim()
    .transform((val) => val.replace(/^./, (match) => match.toUpperCase()))
    .optional(),
  username: z.string().trim().toLowerCase().optional(),
  email: z.string().email().optional(),
  phone: z.string().trim().optional(),
  bio: z.string().max(80).optional(),
  urls: z
    .array(
      z
        .object({
          value: z.string().url({ message: "Ingresa un URL válido." }),
        })
        .transform((obj) => obj.value)
        .optional(),
    )
    .optional(),
});
