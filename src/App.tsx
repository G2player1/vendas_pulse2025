import { useEffect, useState } from 'react';
import { BarChart3, RefreshCw, Database } from 'lucide-react';
import { Sale, SalesSummary } from './types/sales';
import { SalesService } from './services/salesService';
import SummaryCards from './components/SummaryCards';
import SalesTable from './components/SalesTable';
import Charts from './components/Charts';
import FileUpload from './components/FileUpload';

function App() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [useApiData, setUseApiData] = useState(false);

  useEffect(() => {
    loadSalesData();
  }, []);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      const data = await SalesService.getSales();
      setSales(data);
      const summaryData = await SalesService.getSalesSummary(data);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReload = () => {
    loadSalesData();
  };

  const handleToggleDataSource = () => {
    const newValue = !useApiData;
    setUseApiData(newValue);
    SalesService.setUseMockData(!newValue);
    loadSalesData();
  };

  const handleUploadSuccess = () => {
    if (!useApiData) {
      setUseApiData(true);
      SalesService.setUseMockData(false);
    }
    loadSalesData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  const productSales = SalesService.getProductSales(sales);
  const clientSpending = SalesService.getClientSpending(sales);
  const dailySales = SalesService.getDailySales(sales);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard de Vendas</h1>
                <p className="text-sm text-gray-600">Análise completa de vendas e desempenho</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleDataSource}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  useApiData
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Database className="w-4 h-4" />
                {useApiData ? 'API (localhost:8080)' : 'Dados Mock'}
              </button>

              <button
                onClick={handleReload}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Recarregar
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        {summary && <SummaryCards summary={summary} />}

        <div className="mb-8">
          <Charts
            productSales={productSales}
            clientSpending={clientSpending}
            dailySales={dailySales}
          />
        </div>

        <SalesTable sales={sales} />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Fonte de dados atual: {useApiData ? 'API REST (http://localhost:8080/vendas)' : 'Dados Mock'}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
