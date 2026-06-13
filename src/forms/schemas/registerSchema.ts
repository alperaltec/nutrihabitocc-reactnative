import { z } from 'zod'


export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Nombre muy corto')
      .max(20, 'Máximo 20 caracteres'),

    last_name: z
      .string()
      .min(2, 'Apellido muy corto')
      .max(20, 'Máximo 20 caracteres'),

    email: z
      .string()
      .email('Correo inválido'),

    phone_number: z
      .string()
      .regex(
        /^\d{7,15}$/,
        'Número inválido (solo se permiten entre 7 y 15 números)'
      ),

    password: z
      .string()
      .min(6, 'Mínimo 6 caracteres'),

    password_confirmation: z.string(),

    accepted_terms: z.literal(true, {
      message: 'Debes aceptar los términos y condiciones para continuar',
    }),
  })
  .refine(
    data => data.password === data.password_confirmation,
    {
      message: 'Las contraseñas no coinciden',
      path: ['password_confirmation'],
    }
  )

export type Register = z.infer<typeof registerSchema>;