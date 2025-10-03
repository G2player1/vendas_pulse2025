import { ProductSales, ClientSpending, DailySales } from '../types/sales';

interface ChartsProps {
  productSales: ProductSales[];
  clientSpending: ClientSpending[];
  dailySales: DailySales[];
}

export default function Charts({ productSales, clientSpending, dailySales }: ChartsProps) {
  const maxProductQuantity = Math.max(...productSales.map(p => p.quantidade));
  const maxClientSpending = Math.max(...clientSpending.map(c => c.total));
  const maxDailySales = Math.max(...dailySales.map(d => d.total));

  const colors = [
    'bg-blue-500',
    'bg-red-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-teal-500'
  ];

  const pieColors = [
    '#3B82F6',
    '#EF4444',
    '#10B981',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899',
    '#F97316',
    '#14B8A6'
  ];

  const totalClientSpending = clientSpending.reduce((sum, c) => sum + c.total, 0);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Quantidade Vendida por Produto</h3>
        <div className="space-y-4">
          {productSales.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">{item.produto}</span>
                <span className="font-bold text-gray-900">{item.quantidade}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                  style={{ width: `${(item.quantidade / maxProductQuantity) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Gasto Total por Cliente</h3>
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 mb-6">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {clientSpending.map((item, index) => {
                const percentage = (item.total / totalClientSpending) * 100;
                const angle = (percentage / 100) * 360;
                const startAngle = clientSpending
                  .slice(0, index)
                  .reduce((sum, c) => sum + (c.total / totalClientSpending) * 360, 0);

                const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                const endX = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
                const endY = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);

                const largeArcFlag = angle > 180 ? 1 : 0;

                return (
                  <path
                    key={index}
                    d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                    fill={pieColors[index % pieColors.length]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <title>{`${item.cliente}: ${formatCurrency(item.total)} (${percentage.toFixed(1)}%)`}</title>
                  </path>
                );
              })}
              <circle cx="50" cy="50" r="20" fill="white" />
            </svg>
          </div>

          <div className="space-y-2 w-full">
            {clientSpending.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: pieColors[index % pieColors.length] }}
                  />
                  <span className="text-gray-700">{item.cliente}</span>
                </div>
                <span className="font-semibold text-gray-900">{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Evolução das Vendas</h3>
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-between px-4 gap-2">
            {dailySales.map((item, index) => {
              const height = (item.total / maxDailySales) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full group">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-500 cursor-pointer"
                      style={{ height: `${height * 2}px`, minHeight: '20px' }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {formatCurrency(item.total)}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{formatDate(item.data)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
