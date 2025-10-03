import { useState, useRef } from 'react';
import { Upload, FileUp } from 'lucide-react';

interface FileUploadProps {
  onUploadSuccess: () => void;
}

interface VendaData {
  idProduto: string;
  nomeProduto: string;
  idCliente: string;
  nomeCliente: string;
  qtdVendida: number;
  valorUnit: number;
  dataVenda: string;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
  if (!selectedFile) {
    alert('Selecione um arquivo primeiro!');
    return;
  }

  try {
    setUploading(true);

    const text = await selectedFile.text();
    const lines = text.split(/\r?\n/);

    const vendas: VendaData[] = [];

    for (const line of lines) {
      if (!line.trim()) continue;

      const idProduto = line.slice(0, 4).trim();
      const nomeProduto = line.slice(4, 58).trim();
      const idCliente = line.slice(58, 62).trim();
      const nomeCliente = line.slice(62, 112).trim();
      const qtdVendida = parseInt(line.slice(112, 115).trim(), 10);
      const valorUnit = parseFloat(line.slice(116, 125).trim());
      const dataVenda = line.slice(125, 136).trim();

      vendas.push({
        idProduto,
        nomeProduto,
        idCliente,
        nomeCliente,
        qtdVendida,
        valorUnit,
        dataVenda
      });
    }

    console.log('Vendas processadas:', vendas);

    const response = await fetch('https://projetojt-api-rest-production.up.railway.app/vendas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendas)
    });

    console.log('Resposta do fetch:', response);

    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    onUploadSuccess();
  } catch (error) {
    console.error('Erro ao processar arquivo:', error);
  } finally {
    setUploading(false);
  }
};


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileUp className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Importar Arquivo de Vendas</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept=".dat"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
            />
          </label>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Enviar
              </>
            )}
          </button>
        </div>

        {selectedFile && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            <span className="font-medium">Arquivo selecionado:</span> {selectedFile.name}
          </div>
        )}

        <div className="text-xs text-gray-500 mt-2">
          <p>Formato esperado: arquivo .dat com vendas em formato de posição fixa</p>
          <p className="mt-1">O arquivo será enviado para: http://localhost:8080/vendas</p>
        </div>
      </div>
    </div>
  );
}
