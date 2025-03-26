import { useState, useEffect } from 'react';
import { fetchSidraDataGroup } from '@/services/apiSidraService'; // Importando a função ajustada
import { toast } from 'sonner'; // Componente de Toast configurado

export const useSidraGroupData = (year: string, code: string, code2: string) => {
    const [data, setData] = useState<{ labels: string[]; values: number[] }>({
        labels: [],
        values: [],
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Buscar dados da API usando a função fetchSidraDataGroup com os 3 parâmetros
                const response: any[] = await fetchSidraDataGroup(year, code, code2);

                // Validação dos dados recebidos
                if (!Array.isArray(response) || response.length === 0) {
                    setError('Nenhum dado encontrado.');
                    toast.error('Nenhum dado encontrado.');
                    return;
                }

                // Map para armazenar os grupos com seus valores
                const groups: { [key: string]: { D2N: string; V: number }[] } = {};

                response.forEach((item) => {
                    const { D2N, D3N, V } = item;

                    // Verifica se o D3N é "Total", que indica o início de um novo grupo
                    if (D3N === 'Total' && V) {
                        const value = Number(V); // Garantindo que o valor é um número

                        // Se o grupo ainda não existir, cria um novo array
                        if (!groups[D2N]) {
                            groups[D2N] = [];
                        }
                        groups[D2N].push({ D2N, V: value });
                    }
                });

                // Agora, vamos percorrer os grupos e associar os títulos com os valores
                const labels: string[] = [];
                const values: number[] = [];

                // Aqui, percorremos todos os grupos para associar os títulos com os valores
                Object.keys(groups).forEach((key) => {
                    labels.push(key); // Adicionando o valor de D2N (a chave do grupo)

                    // Para cada grupo, vamos somar os valores encontrados ou pegar o mais relevante
                    const totalValue = groups[key].reduce(
                        (sum, item) => sum + item.V,
                        0
                    );

                    // Garantir que estamos adicionando apenas números válidos na lista de valores
                    if (!isNaN(totalValue)) {
                        values.push(totalValue);
                    }
                });

                // Atualizar o estado com os dados processados (labels e valores associados)
                setData({ labels, values });
            } catch (err) {
                console.error('Erro ao carregar os dados:', err);
                setError('Erro ao carregar os dados da API.');
                toast.error('Erro ao carregar os dados da API.');
            } finally {
                setLoading(false); // Finalizar carregamento
            }
        };

        if (year && code && code2) {
            fetchData(); // Realizar a chamada apenas quando os 3 valores forem fornecidos
        }
    }, [year, code, code2]); // Re-executar sempre que ano, código ou código2 mudarem

    return { data, loading, error };
};
