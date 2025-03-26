import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useState, useEffect } from 'react';
import { useSidraGroupData } from '@/hooks/useSidraGroupDataHook';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    data: { labels: string[]; values: number[] };
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                data: data.values,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[500px] mx-auto"
        >
            <Pie data={chartData} options={options} width={300} height={300} />
        </motion.div>
    );
};

const ANOS_DISPONIVEIS = Array.from({ length: 2022 - 2007 + 1 }, (_, i) =>
    (2007 + i).toString()
).reverse();

const VARIAVEIS_DISPONIVEIS = [
    { D2C: '630', D2N: 'Número de empresas' },
    {
        D2C: '1000630',
        D2N: 'Número de empresas - percentual do total geral',
    },
    { D2C: '810', D2N: 'Valor bruto da produção industrial' },
    {
        D2C: '1000810',
        D2N: 'Valor bruto da produção industrial - percentual do total geral',
    },
    { D2C: '824', D2N: 'Total da receita líquida de vendas' },
    {
        D2C: '1000824',
        D2N: 'Total da receita líquida de vendas - percentual do total geral',
    },
    {
        D2C: '825',
        D2N: 'Receita líquida de vendas de produtos e serviços industriais',
    },
    {
        D2C: '1000825',
        D2N: 'Receita líquida de vendas de produtos e serviços industriais - percentual do total geral',
    },
    {
        D2C: '826',
        D2N: 'Estoques de produtos acabados e em elaboração em 31/12 do ano anterior',
    },
    {
        D2C: '1000826',
        D2N: 'Estoques de produtos acabados e em elaboração em 31/12 do ano anterior - percentual do total geral',
    },
    {
        D2C: '827',
        D2N: 'Estoques de produtos acabados e em elaboração em 31/12 do ano de referência',
    },
    {
        D2C: '1000827',
        D2N: 'Estoques de produtos acabados e em elaboração em 31/12 do ano de referência - percentual do total geral',
    },
    { D2C: '808', D2N: 'Custos das operações industriais' },
    {
        D2C: '1000808',
        D2N: 'Custos das operações industriais - percentual do total geral',
    },
    {
        D2C: '828',
        D2N: 'Compras de matérias-primas, materiais auxiliares e componentes',
    },
    {
        D2C: '1000828',
        D2N: 'Compras de matérias-primas, materiais auxiliares e componentes - percentual do total geral',
    },
    {
        D2C: '829',
        D2N: 'Estoques de matérias-primas, materiais auxiliares e componentes em 31/12 do ano anterior',
    },
    {
        D2C: '1000829',
        D2N: 'Estoques de matérias-primas, materiais auxiliares e componentes em 31/12 do ano anterior - percentual do total geral',
    },
    {
        D2C: '830',
        D2N: 'Estoques de matérias-primas, materiais auxiliares e componentes em 31/12 do ano de referência',
    },
    {
        D2C: '1000830',
        D2N: 'Estoques de matérias-primas, materiais auxiliares e componentes em 31/12 do ano de referência - percentual do total geral',
    },
    {
        D2C: '831',
        D2N: 'Compras de energia elétrica e consumo de combustíveis',
    },
    {
        D2C: '1000831',
        D2N: 'Compras de energia elétrica e consumo de combustíveis - percentual do total geral',
    },
    {
        D2C: '832',
        D2N: 'Consumo de peças, acessórios pequenas ferramentas',
    },
    {
        D2C: '1000832',
        D2N: 'Consumo de peças, acessórios pequenas ferramentas - percentual do total geral',
    },
    {
        D2C: '833',
        D2N: 'Serviços industriais prestados por terceiros e de manutenção',
    },
    {
        D2C: '1000833',
        D2N: 'Serviços industriais prestados por terceiros e de manutenção - percentual do total geral',
    },
    { D2C: '811', D2N: 'Valor da transformação industrial' },
    {
        D2C: '1000811',
        D2N: 'Valor da transformação industrial - percentual do total geral',
    },
];

const ChartWithFilters = () => {
    const [anoSelecionado, setAnoSelecionado] = useState('2022');
    const [variavel1Selecionada, setVariavel1Selecionada] = useState('832');
    const [variavel2Selecionada, setVariavel2Selecionada] = useState('825');

    const { data, loading, error } = useSidraGroupData(
        anoSelecionado,
        variavel1Selecionada,
        variavel2Selecionada
    );

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    const chartData = {
        labels: data.labels,
        values: data.values,
    };

    const availableSecondSelectOptions = VARIAVEIS_DISPONIVEIS.filter(
        (variavel) => variavel.D2C !== variavel1Selecionada
    );

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="w-full sm:w-1/3"
                    >
                        <Select
                            value={anoSelecionado}
                            onValueChange={setAnoSelecionado}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o Ano" />
                            </SelectTrigger>
                            <SelectContent>
                                {ANOS_DISPONIVEIS.map((ano) => (
                                    <SelectItem key={ano} value={ano}>
                                        {ano}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="w-full sm:w-1/3"
                    >
                        <Select
                            value={variavel1Selecionada}
                            onValueChange={setVariavel1Selecionada}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o D2N" />
                            </SelectTrigger>
                            <SelectContent>
                                {VARIAVEIS_DISPONIVEIS.map((variavel) => (
                                    <SelectItem
                                        key={variavel.D2C}
                                        value={variavel.D2C}
                                    >
                                        {variavel.D2N}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="w-full sm:w-1/3"
                    >
                        <Select
                            value={variavel2Selecionada}
                            onValueChange={setVariavel2Selecionada}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o D2N" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableSecondSelectOptions.map(
                                    (variavel) => (
                                        <SelectItem
                                            key={variavel.D2C}
                                            value={variavel.D2C}
                                        >
                                            {variavel.D2N}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </motion.div>
                </div>
            </div>

            <motion.div
                className="bg-white shadow-md rounded-lg p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <PieChart data={chartData} />
            </motion.div>
        </div>
    );
};

export default ChartWithFilters;
