'use client';

import HeaderMenu from '@/app/components/menuHeader/page';
import TabelaDinamica from '@/app/components/table/DynamicTable';
import { useEffect, useState } from 'react';
import BarChart from '@/app/components/chart/page';
import React from 'react';

interface ChartData {
    labels: string[];
    values: number[];
}

export default function page() {
    return (
        <div className="w-full h-dvh">
            <HeaderMenu></HeaderMenu>

            <div className="container mx-auto px-4 pt-24">
                <div className="flex gap-4 flex-col">
                    <div className="w-full">
                        <TabelaDinamica></TabelaDinamica>
                    </div>

                    <div className="w-full">
                        <BarChart />
                    </div>
                </div>
            </div>
        </div>
    );
}
