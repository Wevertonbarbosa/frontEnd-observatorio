import axios from 'axios';

const api = axios.create({
    baseURL: 'https://apisidra.ibge.gov.br/values',
    headers: {
        Accept: 'application/json',
    },
});

export const fetchSidraData = async (year: any, code: any) => {
    try {
        const response = await api.get(
            `/t/1842/n1/all/v/${code}/c12762/all/p/${year}`
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados da API SIDRA:', error);
        throw error;
    }
};

export const fetchSidraDataGroup = async (year: any, code: any, code2: any) => {
    try {
        const response = await api.get(
            `/t/1842/n1/all/v/${code},${code2}/c12762/all/p/${year}`
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados da API SIDRA:', error);
        throw error;
    }
};
