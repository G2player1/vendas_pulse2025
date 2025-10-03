import { Sale, BackendVenda, SalesSummary, ProductSales, ClientSpending, DailySales } from '../types/sales';

const mockData: Sale[] = [
  {
    id_venda: 1,
    data_venda: "2025-09-29",
    quantidade: 2,
    produto: { id: 1001, nome: "Teclado Mecânico Gamer", valor_unitario: 350.75 },
    cliente: { id: 201, nome: "Ana Silva" },
    valor_total_venda: 701.50
  },
  {
    id_venda: 2,
    data_venda: "2025-09-29",
    quantidade: 1,
    produto: { id: 1002, nome: "Mouse Sem Fio Ergonômico", valor_unitario: 120.00 },
    cliente: { id: 202, nome: "Carlos Pereira" },
    valor_total_venda: 120.00
  },
  {
    id_venda: 3,
    data_venda: "2025-09-30",
    quantidade: 3,
    produto: { id: 1003, nome: "Monitor LED 24\"", valor_unitario: 899.90 },
    cliente: { id: 201, nome: "Ana Silva" },
    valor_total_venda: 2699.70
  },
  {
    id_venda: 4,
    data_venda: "2025-09-30",
    quantidade: 1,
    produto: { id: 1001, nome: "Teclado Mecânico Gamer", valor_unitario: 350.75 },
    cliente: { id: 203, nome: "Maria Santos" },
    valor_total_venda: 350.75
  },
  {
    id_venda: 5,
    data_venda: "2025-10-01",
    quantidade: 2,
    produto: { id: 1004, nome: "Webcam Full HD", valor_unitario: 280.00 },
    cliente: { id: 202, nome: "Carlos Pereira" },
    valor_total_venda: 560.00
  },
  {
    id_venda: 6,
    data_venda: "2025-10-01",
    quantidade: 1,
    produto: { id: 1002, nome: "Mouse Sem Fio Ergonômico", valor_unitario: 120.00 },
    cliente: { id: 201, nome: "Ana Silva" },
    valor_total_venda: 120.00
  },
  {
    id_venda: 7,
    data_venda: "2025-10-02",
    quantidade: 4,
    produto: { id: 1005, nome: "Headset Gamer RGB", valor_unitario: 450.00 },
    cliente: { id: 204, nome: "João Oliveira" },
    valor_total_venda: 1800.00
  },
  {
    id_venda: 8,
    data_venda: "2025-10-02",
    quantidade: 2,
    produto: { id: 1003, nome: "Monitor LED 24\"", valor_unitario: 899.90 },
    cliente: { id: 203, nome: "Maria Santos" },
    valor_total_venda: 1799.80
  }
];

export class SalesService {
  private static apiEndpoint = 'http://localhost:8080/vendas';
  private static useMockData = true;

  static setUseMockData(value: boolean) {
    this.useMockData = value;
  }

  private static transformBackendToSale(vendas: BackendVenda[]): Sale[] {
    return vendas.map((venda, index) => ({
      id_venda: index + 1,
      data_venda: venda.dataVenda,
      quantidade: venda.qtdVendida,
      produto: {
        id: parseInt(venda.produto.idProduto, 10),
        nome: venda.produto.nomeProduto,
        valor_unitario: venda.produto.valorUnit
      },
      cliente: {
        id: parseInt(venda.cliente.idCliente, 10),
        nome: venda.cliente.nomeCliente
      },
      valor_total_venda: venda.qtdVendida * venda.produto.valorUnit
    }));
  }

  static async getSales(): Promise<Sale[]> {
    try {
      if (this.useMockData) {
        return mockData;
      }

      const response = await fetch(this.apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar vendas da API');
      }

      const vendas: BackendVenda[] = await response.json();
      return this.transformBackendToSale(vendas);
    } catch (error) {
      console.error('Error fetching sales:', error);
      console.log('Retornando dados mock como fallback');
      return mockData;
    }
  }

  static async getSalesSummary(sales: Sale[]): Promise<SalesSummary> {
    const totalVendido = sales.reduce((sum, sale) => sum + sale.valor_total_venda, 0);

    const productQuantities = new Map<string, number>();
    sales.forEach(sale => {
      const current = productQuantities.get(sale.produto.nome) || 0;
      productQuantities.set(sale.produto.nome, current + sale.quantidade);
    });

    let produtoMaisVendido = '';
    let maxQuantity = 0;
    productQuantities.forEach((quantity, product) => {
      if (quantity > maxQuantity) {
        maxQuantity = quantity;
        produtoMaisVendido = product;
      }
    });

    const clientSpending = new Map<string, number>();
    sales.forEach(sale => {
      const current = clientSpending.get(sale.cliente.nome) || 0;
      clientSpending.set(sale.cliente.nome, current + sale.valor_total_venda);
    });

    let clienteTopComprador = '';
    let maxSpending = 0;
    clientSpending.forEach((total, client) => {
      if (total > maxSpending) {
        maxSpending = total;
        clienteTopComprador = client;
      }
    });

    return {
      totalVendido,
      produtoMaisVendido,
      clienteTopComprador
    };
  }

  static getProductSales(sales: Sale[]): ProductSales[] {
    const productMap = new Map<string, number>();

    sales.forEach(sale => {
      const current = productMap.get(sale.produto.nome) || 0;
      productMap.set(sale.produto.nome, current + sale.quantidade);
    });

    return Array.from(productMap.entries()).map(([produto, quantidade]) => ({
      produto,
      quantidade
    }));
  }

  static getClientSpending(sales: Sale[]): ClientSpending[] {
    const clientMap = new Map<string, number>();

    sales.forEach(sale => {
      const current = clientMap.get(sale.cliente.nome) || 0;
      clientMap.set(sale.cliente.nome, current + sale.valor_total_venda);
    });

    return Array.from(clientMap.entries()).map(([cliente, total]) => ({
      cliente,
      total
    }));
  }

  static getDailySales(sales: Sale[]): DailySales[] {
    const dailyMap = new Map<string, number>();

    sales.forEach(sale => {
      const current = dailyMap.get(sale.data_venda) || 0;
      dailyMap.set(sale.data_venda, current + sale.valor_total_venda);
    });

    return Array.from(dailyMap.entries())
      .map(([data, total]) => ({ data, total }))
      .sort((a, b) => a.data.localeCompare(b.data));
  }
}
