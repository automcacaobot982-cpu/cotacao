# Portal de Cotações · Belt Correias

Portal interno de gestão de cotações, hospedado como **PWA** (aplicativo web instalável)
no GitHub Pages. Lê e grava numa planilha Google via `gviz` (leitura) e Google Apps
Script (gravação).

## O que tem neste repositório

| Arquivo | Para que serve |
|---|---|
| `index.html` | O portal em si (é o que o GitHub Pages publica). |
| `manifest.json` | Configuração do app instalável (nome, ícones, cores). |
| `sw.js` | Service worker: permite instalar e abrir offline; mantém os dados sempre frescos. |
| `icons/` | Ícones do app (polias + correia). |
| `favicon.png` | Ícone da aba do navegador. |
| `.nojekyll` | Impede o GitHub de reprocessar os arquivos. |
| `apps-script/Code.gs` | **Backend.** NÃO é publicado pelo Pages — vai colado no editor do Apps Script da planilha. Está aqui só como backup versionado. |

---

## 1) Publicar no GitHub Pages

### Opção A — pelo site do GitHub (mais simples)

1. Crie um repositório novo em <https://github.com/new> (ex.: `portal-cotacoes-belt`).
   Pode ser **público** ou **privado** (Pages funciona nos dois em contas gratuitas atuais).
2. Na página do repositório vazio, clique em **"uploading an existing file"**.
3. Arraste **todo o conteúdo desta pasta** (o `index.html`, `manifest.json`, `sw.js`,
   `favicon.png`, `.nojekyll`, a pasta `icons/` e a pasta `apps-script/`). Confirme com **Commit changes**.
4. Vá em **Settings ▸ Pages**.
5. Em **Build and deployment ▸ Source**, escolha **Deploy from a branch**.
6. Em **Branch**, selecione **main** e a pasta **/ (root)**. Clique **Save**.
7. Aguarde ~1 minuto. A URL aparece no topo dessa mesma tela, no formato:
   `https://SEU-USUARIO.github.io/portal-cotacoes-belt/`

### Opção B — pela linha de comando (git)

```bash
cd portal-cotacoes-belt
git init
git add .
git commit -m "Portal de Cotações Belt (PWA)"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/portal-cotacoes-belt.git
git push -u origin main
```
Depois faça os passos **4 a 7** da Opção A para ligar o Pages.

---

## 2) Antes de usar — conferir 2 coisas

1. **A planilha precisa estar compartilhada como "Qualquer pessoa com o link: Leitor".**
   Isso é o que permite o portal *ler* os dados de qualquer lugar. (A gravação não
   depende disso — quem grava é o Apps Script, rodando na sua conta.)

2. **A URL do Apps Script precisa estar certa no `index.html`.**
   Ela fica no início do `<script>`, na constante `CONFIG`:
   ```js
   const CONFIG = {
     SHEET_ID: '...',
     GID: '0',
     WEB_APP_URL: 'https://script.google.com/macros/s/.../exec'  // ← a URL /exec da sua implantação
   };
   ```
   Se você trocar a implantação do Apps Script, edite essa linha e envie de novo ao GitHub.

> **Lembrete:** para as **gravações** funcionarem, a implantação do Apps Script tem que
> estar servindo a versão mais nova do `Code.gs`. Ao editar o código, publique com
> **Implantar ▸ Gerenciar implantações ▸ (lápis) ▸ Versão: Nova versão ▸ Implantar**.
> A **leitura** funciona assim que a planilha estiver compartilhada, independente disso.

---

## 3) Instalar no celular Android

1. Abra a URL do Pages no **Google Chrome** do Android.
2. Toque no menu **⋮** (três pontos, canto superior direito).
3. Toque em **"Instalar app"** (ou **"Adicionar à tela inicial"**).
4. Confirme. O ícone das polias aparece na tela inicial e abre em tela cheia, como um app.

> Se a opção não aparecer de primeira, aguarde a página carregar por completo e recarregue
> uma vez — o Chrome precisa detectar o `manifest.json` e o service worker.

### iPhone / iPad (opcional)
No **Safari**: botão **Compartilhar** ▸ **Adicionar à Tela de Início**.

---

## 4) Atualizar o app depois

Sempre que enviar uma versão nova dos arquivos ao GitHub, o app se atualiza sozinho na
próxima vez que for aberto **com internet**. Se você mexer no `sw.js`, troque o número da
versão no topo dele (`cotacoes-belt-v1` → `v2`, etc.) para forçar a limpeza do cache antigo.

---

## Operadores e senhas

Os operadores e senhas estão definidos no `index.html` (constante `OPERADORES`). As senhas
atuais são provisórias — recomendo trocá-las por senhas fortes antes de distribuir o link.
