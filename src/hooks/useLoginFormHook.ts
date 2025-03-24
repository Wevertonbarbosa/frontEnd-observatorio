import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { loginSchema } from '@/schemas/useLoginSchema';
import { z } from 'zod';
import { useSignIn } from '@clerk/nextjs';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';

type LoginFormData = z.infer<typeof loginSchema>;

export function useLoginForm() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: LoginFormData) => {
        if (!isLoaded) {
            return;
        }

        try {
            const result = await signIn?.create({
                identifier: data.email,
                password: data.password,
            });

            if (result?.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                router.push('/dashboard');
                console.log(result);
            }
        } catch (err) {
            if (isClerkAPIResponseError(err)) {
                console.log(err.message);
            }
            //tratar as mensagens de error o retorno
        }
    };

    return { register, handleSubmit, errors, isSubmitting, onSubmit };
}
