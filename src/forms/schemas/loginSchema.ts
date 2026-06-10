import { z } from 'zod'
export const loginSchema = z.object({
  email: z.email("Correo Invalido"),
  password: z.string()
})

  export type Login = z.infer<typeof loginSchema>;