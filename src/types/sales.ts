export interface Product {
  id: number;
  nome: string;
  valor_unitario: number;
}

export interface Client {
  id: number;
  nome: string;
}

export interface Sale {
  id_venda: number;
  data_venda: string;
  quantidade: number;
  produto: Product;
  cliente: Client;
  valor_total_venda: number;
}

export interface BackendVenda {
  produto: {
    idProduto: string;
    nomeProduto: string;
    valorUnit: number;
  };
  cliente: {
    idCliente: string;
    nomeCliente: string;
  };
  qtdVendida: number;
  dataVenda: string;
}

export interface SalesSummary {
  totalVendido: number;
  produtoMaisVendido: string;
  clienteTopComprador: string;
}

export interface ProductSales {
  produto: string;
  quantidade: number;
}

export interface ClientSpending {
  cliente: string;
  total: number;
}

export interface DailySales {
  data: string;
  total: number;
}
