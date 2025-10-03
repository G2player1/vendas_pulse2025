import { TrendingUp, Package, Users } from 'lucide-react';
import { SalesSummary } from '../types/sales';

interface SummaryCardsProps {
  summary: SalesSummary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Vendido',
      value: `R$ ${summary.totalVendido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      borderColor: 'border-l-blue-500',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Produto Mais Vendido',
      value: summary.produtoMaisVendido,
      icon: Package,
      borderColor: 'border-l-red-500',
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Cliente Top',
      value: summary.clienteTopComprador,
      icon: Users,
      borderColor: 'border-l-green-500',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-white rounded-lg shadow-sm border-l-4 ${card.borderColor} p-6 hover:shadow-md transition-shadow`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 break-words">{card.value}</p>
            </div>
            <div className={`${card.bgColor} p-3 rounded-lg`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
