import type { Metadata } from 'next';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { redirect, unauthorized } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Bem-vindo(a) faça seu login',
    description: 'Páginal inicial de login',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { userId } = await auth();

    if (userId) {
        redirect('/dashboard');
    }

    return (
        <ClerkProvider>
            <html lang="pt-BR">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
