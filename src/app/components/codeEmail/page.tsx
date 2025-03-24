'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignUp } from '@clerk/nextjs';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';

export default function VerificationCode() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { isLoaded, signUp, setActive } = useSignUp();

    // Initialize refs array
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6);
    }, []);

    const handleCodeChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d*$/.test(value)) return;

        const newCode = [...code];
        // Take only the last character if pasting multiple characters
        newCode[index] = value.slice(-1);
        setCode(newCode);

        // Auto-focus next input if current input is filled
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Handle arrow keys
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const pastedCode = pastedData.replace(/\D/g, '').slice(0, 6).split('');

        const newCode = [...code];
        pastedCode.forEach((digit, index) => {
            if (index < 6) newCode[index] = digit;
        });

        setCode(newCode);

        // Focus the next empty input or the last input if all are filled
        const nextEmptyIndex = newCode.findIndex((digit) => !digit);
        if (nextEmptyIndex !== -1) {
            inputRefs.current[nextEmptyIndex]?.focus();
        } else if (newCode[5]) {
            inputRefs.current[5]?.focus();
        }
    };

    //reenviar o código
    const handleResendCode = async () => {
        setIsResending(true);
        // This would handle resending the code in a real implementation

        try {
            await signUp?.prepareEmailAddressVerification({
                strategy: 'email_code',
            });

            setIsResending(false);
        } catch (err) {
            if (isClerkAPIResponseError(err)) {
                console.log(err.message);
            }

            setIsResending(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const unifiedCode = code.join('');

        if (!isLoaded) {
            return;
        }
        setIsLoading(true);

        try {
            const verifyCode = await signUp.attemptEmailAddressVerification({
                code: unifiedCode,
            });

            if (verifyCode.status === 'complete') {
                await setActive({ session: verifyCode.createdSessionId });
            }
            router.push('/dashboard');

            setIsLoading(false);
        } catch (err) {
            if (isClerkAPIResponseError(err)) {
                console.log(err.message);
            }

            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md overflow-hidden rounded-xl bg-card shadow-lg"
            >
                <div className="p-8">
                    <div className="space-y-2 text-center">
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-bold tracking-tight"
                        >
                            Verificação do Código
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-sm text-muted-foreground"
                        >
                            Enviamos um código de verificação de 6 dígitos para
                            seu e-mail
                        </motion.p>
                    </div>

                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        onSubmit={handleSubmit}
                        className="space-y-6 pt-6"
                    >
                        <div className="space-y-4">
                            <Label htmlFor="verification-code">
                                Verificar Código
                            </Label>
                            <div className="flex justify-between gap-2">
                                {code.map((digit, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full"
                                    >
                                        <Input
                                            id={
                                                index === 0
                                                    ? 'verification-code'
                                                    : undefined
                                            }
                                            ref={(el: any) =>
                                                (inputRefs.current[index] = el)
                                            }
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) =>
                                                handleCodeChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={(e) =>
                                                handleKeyDown(index, e)
                                            }
                                            onPaste={
                                                index === 0
                                                    ? handlePaste
                                                    : undefined
                                            }
                                            className="h-14 text-center text-xl font-semibold"
                                            autoFocus={index === 0}
                                            required
                                        />
                                    </motion.div>
                                ))}
                            </div>
                            <p className="text-center text-xs text-muted-foreground">
                                Digite o código de 6 dígitos enviado para seu
                                endereço de e-mail
                            </p>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={
                                    isLoading || code.some((digit) => !digit)
                                }
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                                        <span>Verificando...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>Verifique o código</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                )}
                            </Button>
                        </motion.div>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 text-center"
                    >
                        <p className="text-sm text-muted-foreground">
                            Não recebeu o código?
                        </p>
                        <Button
                            variant="link"
                            onClick={handleResendCode}
                            disabled={isResending}
                            className="mt-1 h-auto p-0 text-sm font-medium"
                        >
                            {isResending ? (
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                    <span>Reenviando...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <span>Reenviar código</span>
                                </div>
                            )}
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 text-center text-sm"
                    >
                        <Link
                            href="/"
                            className="font-medium text-primary hover:underline"
                        >
                            Voltar para o Login
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
