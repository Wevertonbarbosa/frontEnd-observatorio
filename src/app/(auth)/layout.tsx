import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Página inicial dashboard',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { userId } = await auth();

    if (!userId) {
        redirect('/');
    }

    return (
        <ClerkProvider>
            <html lang="pt-BR">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    {children}
                    <Toaster />
                </body>
            </html>
        </ClerkProvider>
    );
}
