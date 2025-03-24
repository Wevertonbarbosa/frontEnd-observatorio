import { z } from 'zod';

export const RegisterSchema = z
    .object({
        email: z.string().email('E-mail inválido'),
        password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],
    });
