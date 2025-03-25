import { useState, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { useSidraData } from '@/hooks/useSidraDataHook'; // Importe o hook que você criou
import React from 'react';

const ANOS_DISPONIVEIS = Array.from({ length: 2022 - 2007 + 1 }, (_, i) =>
    (2007 + i).toString()
).reverse();
const TITULOS_POR_PAGINA = 7;

const TabelaDinamica = () => {
    const [anoSelecionado, setAnoSelecionado] = useState('2022');
    const [variavelSelecionada, setVariavelSelecionada] = useState('630');
    const [currentPage, setCurrentPage] = useState(1);

    // Conectando o hook para obter dados
    const { processedData, loading, error } = useSidraData(
        anoSelecionado,
        variavelSelecionada
    );

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

    const filteredData = useMemo(
        () =>
            processedData?.filter(
                (item) =>
                    item.title ===
                        VARIAVEIS_DISPONIVEIS.find(
                            (variavel) => variavel.D2C === variavelSelecionada
                        )?.D2N && item.year === anoSelecionado // Use D4C para acessar o ano
            ),
        [processedData, anoSelecionado, variavelSelecionada]
    );

    const totalPages = Math.ceil(filteredData?.length / TITULOS_POR_PAGINA);
    const startIndex = (currentPage - 1) * TITULOS_POR_PAGINA;
    const currentData = filteredData?.slice(
        startIndex,
        startIndex + TITULOS_POR_PAGINA
    );

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <h2 className="text-xl font-bold">Dados Estatísticos</h2>
                <div className="flex gap-4">
                    <Select
                        value={anoSelecionado}
                        onValueChange={setAnoSelecionado}
                    >
                        <SelectTrigger className="w-48">
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

                    <Select
                        value={variavelSelecionada}
                        onValueChange={setVariavelSelecionada}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Selecione a Variável" />
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
                </div>
            </div>

            <div className="overflow-x-auto max-w-full max-h-96 overflow-y-auto border rounded-lg">
                <Suspense fallback={<Skeleton className="w-32 h-10" />}>
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Skeleton className="w-32 h-10" />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500">{error}</div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Table className="w-full table-auto">
                                <TableHeader className="bg-blue-600 text-white sticky top-0 z-10">
                                    <TableRow>
                                        <TableHead className="p-3">
                                            Título
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody className="divide-y divide-gray-200">
                                    {currentData?.map((row, index) => (
                                        <React.Fragment key={index}>
                                            {/* Título centralizado */}
                                            <TableRow>
                                                <TableCell
                                                    colSpan={2}
                                                    className="text-center font-bold p-3"
                                                >
                                                    {row.title}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell className="text-center font-bold p-3">
                                                    Subtitulo
                                                </TableCell>
                                                <TableCell className="text-center font-bold ">
                                                    Valor
                                                </TableCell>
                                            </TableRow>

                                            {/* Subtítulos e valores na mesma linha */}
                                            {row.subtitulos.map(
                                                (subtitulo, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell
                                                            className="text-start p-3 font-medium"
                                                            style={{
                                                                maxWidth:
                                                                    '150px', // Ajuste conforme necessário
                                                                overflow:
                                                                    'hidden',
                                                                textOverflow:
                                                                    'ellipsis',
                                                                whiteSpace:
                                                                    'nowrap',
                                                            }}
                                                        >
                                                            {subtitulo}
                                                        </TableCell>
                                                        <TableCell className="text-start p-3">
                                                            {row.values[i] ||
                                                                '-'}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </motion.div>
                    )}
                </Suspense>
            </div>
        </div>
    );
};

export default TabelaDinamica;
