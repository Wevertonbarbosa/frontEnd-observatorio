import { useEffect, useState } from 'react';
import { fetchSidraData } from '@/services/apiSidraService';
import { toast } from 'sonner'; // Supondo que você tenha um componente de Toast configurado

interface SidraEntry {
    D2N: string; // Título da tabela (Ex: "Número de empresas (Unidades)")
    D3N: string; // Subtítulo (Ex: "B Indústrias extrativas")
    V: string; // Valor correspondente
    D4C: string; // Ano
}

interface ProcessedData {
    title: string;
    subtitulos: string[]; // Os subtítulos (D3N)
    values: string[]; // Os valores correspondentes (V)
    year: string; // Adicionando a propriedade "year" para armazenar o ano (D4C)
}

export const useSidraData = (selectedYear: string, selectedVariable: string) => {
    const [processedData, setProcessedData] = useState<ProcessedData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getData = async () => {
            setLoading(true); // Começar o carregamento
            try {
                const rawData: SidraEntry[] = await fetchSidraData(selectedYear, selectedVariable);

                // Validar dados antes de processar
                if (!Array.isArray(rawData) || rawData.length === 0) {
                    setError('Nenhum dado encontrado.');
                    toast.error('Nenhum dado encontrado.');
                    return;
                }

                // Processar os dados para estruturar corretamente a tabela
                const groupedData: { [key: string]: ProcessedData } = {};

                rawData.forEach((entry) => {
                    const { D2N, D3N, V, D4C } = entry;

                    if (!D2N || !D3N || !V) {
                        console.warn(`Dados inválidos: ${JSON.stringify(entry)}`);
                        return; // Ignorar entradas inválidas
                    }

                    // Agrupar os dados pelo título (D2N)
                    if (!groupedData[D2N]) {
                        groupedData[D2N] = {
                            title: D2N,
                            subtitulos: [],
                            values: [],
                            year: D4C, // Adicionando o ano à estrutura ProcessedData
                        };
                    }

                    // Adicionar subtítulo e valor, garantindo que não se repitam
                    if (!groupedData[D2N].subtitulos.includes(D3N)) {
                        groupedData[D2N].subtitulos.push(D3N);
                        groupedData[D2N].values.push(V);
                    }
                });

                // Verificar se temos dados processados
                if (Object.keys(groupedData).length === 0) {
                    setError('Erro ao processar os dados.');
                    toast.error('Erro ao processar os dados.');
                    return;
                }

                // Atualizar o estado com os dados processados
                setProcessedData(Object.values(groupedData));
            } catch (err) {
                console.error('Erro ao carregar os dados:', err);
                setError('Erro ao carregar os dados da API.');
                toast.error('Erro ao carregar os dados da API.');
            } finally {
                setLoading(false); // Terminar o carregamento
            }
        };

        getData();
    }, [selectedYear, selectedVariable]); // Agora o efeito depende de selectedYear e selectedVariable

    return { processedData, loading, error };
};
