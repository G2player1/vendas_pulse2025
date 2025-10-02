const fileInput = document.getElementById('fileInput');
const enviarBtn = document.getElementById('enviar');

enviarBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert('Selecione um arquivo primeiro!');
    return;
  }

  const text = await file.text();
  const lines = text.split(/\r?\n/);

  const vendas = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    const idProduto = line.slice(0, 4).trim();
    const nomeProduto = line.slice(4, 58).trim();
    const idCliente = line.slice(58, 62).trim();
    const nomeCliente = line.slice(62, 112).trim();
    const qtdVendida = parseInt(line.slice(112, 116).trim(), 10);
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

  console.log(vendas);

  // Envia as vendas para o back-end
  const response = await fetch('/api/vendas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vendas)
  });

  const result = await response.json();
  console.log(result);
  alert(`Foram enviadas ${vendas.length} vendas`);
});