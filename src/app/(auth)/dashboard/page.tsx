'use client'

import HeaderMenu from '@/app/components/menuHeader/page';
import TabelaDinamica from '@/app/components/table/DynamicTable';
import Table from '@/app/components/table/page';
import React from 'react';

export default function page() {
    return (
        <div className="w-full h-dvh">
            <HeaderMenu></HeaderMenu>

            
            <div className="container mx-auto px-4 pt-24">
                <h2>ROTA QUE VAI SER PRIVADA</h2>

                    <div>
                        <TabelaDinamica></TabelaDinamica>
                    </div>

            </div>
        </div>
    );
}
