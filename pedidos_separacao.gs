/**
 * ============================================================
 *  Apps Script — Base "pedidos_separacao" (Belt Correias)
 * ------------------------------------------------------------
 *  Recebe o POST enviado pelo index.html e grava uma linha com:
 *    Coluna A = data de inclusão  (DD/MM/AAAA HH:MM, gerada aqui)
 *    Coluna B = número do pedido  (numérico)
 *    Coluna C = urgente           ("1" se urgente, senão vazio)
 *    Coluna D = operador          (nome de quem registrou)
 *
 *  COMO PUBLICAR (passo a passo mais abaixo, na conversa):
 *    Implantar > Nova implantação > Tipo: App da Web
 *    Executar como: Eu  |  Quem tem acesso: Qualquer pessoa
 *  Depois copie a URL que termina em /exec e cole no index.html
 *  (constante SHEETS_WEBAPP_URL).
 * ============================================================
 */

// Deixe vazio para usar a primeira aba (gid 0).
// Se os dados ficam em uma aba com nome específico, coloque o nome aqui.
const ABA = '';

/** Recebe o pedido e grava na planilha. */
function doPost(e) {
  try {
    const corpo = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const r = corpo.payload || corpo;   // aceita {acao, payload:{...}} ou o objeto direto

    const numero = String(r.B_pedido != null ? r.B_pedido : (r.pedido || '')).trim();
    if (!numero) return _json({ ok: false, erro: 'Número do pedido vazio.' });

    const dataInclusao = agora_();                               // Coluna A (gerada no servidor)
    const pedido       = isNaN(Number(numero)) ? numero : Number(numero); // Coluna B
    const urgente      = (r.C_urgente === '1' || r.C_urgente === 1) ? '1' : ''; // Coluna C
    const operador     = String(r.D_operador || r.operador || '').trim();       // Coluna D

    _aba().appendRow([dataInclusao, pedido, urgente, operador]);
    return _json({ ok: true, pedido: pedido });
  } catch (err) {
    return _json({ ok: false, erro: String(err) });
  }
}

/** Teste rápido no navegador: abrir a URL /exec deve mostrar {"ok":true,...} */
function doGet() {
  return _json({ ok: true, servico: 'pedidos_separacao', status: 'online' });
}

/* ---------- utilitários ---------- */

function _aba() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ABA) {
    const a = ss.getSheetByName(ABA);
    if (a) return a;
  }
  return ss.getSheets()[0];
}

function agora_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
