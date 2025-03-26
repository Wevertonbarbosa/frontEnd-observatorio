import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import TabelaDinamica from '@/app/components/table/DynamicTable';
import { useSidraData } from '@/hooks/useSidraDataHook';
import '@testing-library/jest-dom';

// Mocking do hook useSidraData
jest.mock('@/hooks/useSidraDataHook');

describe('TabelaDinamica', () => {
    const mockData = [
        {
            title: 'Número de empresas',
            year: '2022',
            subtitulos: ['Subtítulo 1', 'Subtítulo 2'],
            values: [10, 20],
        },
    ];

    beforeEach(() => {
        (useSidraData as jest.Mock).mockReturnValue({
            processedData: mockData,
            loading: false,
            error: null,
        });
    });

    test('deve mudar o valor do ano corretamente', async () => {
        render(
            <Suspense fallback={<div>Loading...</div>}>
                <TabelaDinamica />
            </Suspense>
        );

        // Encontre o select de Ano
        const selectAno = screen.getByRole('combobox', {
            name: /Selecione o Ano/i,
        });

        // Simule a mudança do valor para '2021'
        fireEvent.change(selectAno, { target: { value: '2021' } });

        // Aguarde a atualização e verifique se o valor foi alterado
        await waitFor(() => {
            // Aqui, estamos acessando a propriedade 'value' de um HTMLSelectElement
            expect((selectAno as HTMLSelectElement).value).toBe('2021');
        });
    });
});
