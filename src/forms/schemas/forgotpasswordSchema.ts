import z, { email } from "zod";

export const forgotpasswordSchema = z.object({
  email: z.email("Correo Invalido")
})

export const recoverypasswordScheme = z.object({
  email: z.string().email("Correo Inválido"),
  code: z.string().min(4, "El código debe tener al menos 4 dígitos"),
  password: z
    .string()
    .min(6, 'Mínimo 6 caracteres'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Las contraseñas no coinciden",
  path: ["password_confirmation"],
});

export type ForgotPasswordI = z.infer<typeof forgotpasswordSchema>;
export type RecoveryPassword = z.infer<typeof recoverypasswordScheme>;