import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Nombre muy corto").max(80),
  email: z.string().trim().email("Correo inválido").max(120),
  message: z.string().trim().min(5, "Cuéntanos un poco más").max(2000),
  company: z.string().max(0).optional(), // honeypot: must stay empty
});

export type ContactInput = z.infer<typeof contactSchema>;
