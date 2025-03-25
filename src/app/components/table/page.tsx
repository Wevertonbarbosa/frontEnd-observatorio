import { useSidraData } from "@/hooks/useSidraDataHook";

const Table = () => {
  const { processedData, loading, error } = useSidraData();

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="overflow-x-auto p-4">
      {processedData.map(({ title, columns, rows }) => (
        <div key={title} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {columns.map((col) => (
                  <th key={col} className="border border-gray-300 p-2">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {columns.map((col) => (
                  <td key={col} className="border border-gray-300 p-2 text-center">
                    {rows[col] || "-"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Table;
