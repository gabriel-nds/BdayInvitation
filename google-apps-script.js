// Google Apps Script para receber dados do formulário e salvar no Google Sheets
// Cole este código em https://script.google.com/

function doPost(e) {
  try {
    // Verificar se os dados POST existem
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: 'Dados não recebidos. Este endpoint deve ser chamado via POST.'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // ID da sua planilha
    const SHEET_ID = '1AHlizYONfLoEPl4sxuQyNm8vQiCd5BKEh1WvmrYcLz0';
    
    // Abrir a planilha
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Parse dos dados recebidos
    const data = JSON.parse(e.postData.contents);
    
    // Verificar se já existe cabeçalho, se não, criar
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 5).setValues([
        ['Nome', 'Email', 'Data/Hora', 'User Agent', 'IP']
      ]);
      
      // Formatar cabeçalho
      const headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
    }
    
    // Verificar se o email já existe (apenas se há mais de 1 linha - cabeçalho)
    let emailExists = false;
    const currentRows = sheet.getLastRow();
    if (currentRows > 1) {
      const numRows = currentRows - 1; // Número de linhas de dados (excluindo cabeçalho)
      if (numRows > 0) {
        const emailColumn = sheet.getRange(2, 2, numRows, 1).getValues();
        emailExists = emailColumn.some(row => row[0] === data.email);
      }
    }
    
    if (emailExists) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: 'Este email já foi cadastrado!'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Adicionar nova linha com os dados
    const newRow = [
      data.name,
      data.email,
      new Date(data.timestamp),
      data.userAgent,
      '' // IP será preenchido pelo Google Apps Script se necessário
    ];
    
    sheet.appendRow(newRow);
    
    // Formatar a nova linha
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow, 1, 1, 5);
    
    // Alternar cores das linhas
    if (lastRow % 2 === 0) {
      range.setBackground('#f8f9fa');
    }
    
    // Formatar data
    sheet.getRange(lastRow, 3).setNumberFormat('dd/mm/yyyy hh:mm:ss');
    
    // Auto-resize das colunas
    sheet.autoResizeColumns(1, 5);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'RSVP registrado com sucesso!',
        row: lastRow
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Erro no Google Apps Script:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Erro interno do servidor',
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Função para testar o script (simula uma requisição POST)
function testScript() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        name: 'Teste Gabriel',
        email: 'teste@gmail.com',
        timestamp: new Date().toISOString(),
        userAgent: 'Test Browser'
      })
    }
  };
  
  const result = doPost(testData);
  console.log(result.getContent());
}

// Função para testar sem dados POST (simula o erro que você teve)
function testWithoutData() {
  const result = doPost({});
  console.log(result.getContent());
} 