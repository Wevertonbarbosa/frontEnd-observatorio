import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSignUp } from '@clerk/nextjs';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { RegisterSchema } from '@/schemas/useRegisterSchema';
import { useState } from 'react';

type RegisterFormData = z.infer<typeof RegisterSchema>;

export function useRegisterForm() {
    const router = useRouter();
    const { isLoaded, signUp } = useSignUp();
    const [emailVerify, setEmailVerify] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(RegisterSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: RegisterFormData) => {
        if (!isLoaded) {
            return;
        }

        try {
            await signUp?.create({
                emailAddress: data.email,
                password: data.password,
            });

            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code',
            });

            setEmailVerify(true);

            router.push('/check-email');
        } catch (err) {
            if (isClerkAPIResponseError(err)) {
                console.log(err.message);
            }
            //tratar as mensagens de error o retorno
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        onSubmit,
        isValid,
        emailVerify,
    };
}
