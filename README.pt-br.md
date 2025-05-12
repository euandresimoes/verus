
![Verus Banner](https://github.com/user-attachments/assets/5173589a-5dd8-4fd4-9536-7e039365acae)

# 📦 Verus CLI - O Assistente de Commits com IA

**Verus** é uma ferramenta de linha de comando (CLI) que integra inteligência artificial para gerar mensagens de commit automaticamente em seus repositórios Git. A partir de um breve resumo das alterações feitas nos arquivos, o Verus utiliza a API da OpenAI para sugerir uma mensagem formatada, como:

`✨ feat(auth/signup): implemented email verification`

---

## 📋 Requisitos

Para usar o **Verus**, você precisa de uma **chave de API da OpenAI** com pelo menos **$0,50 de crédito**.

---

## 💻 Instalação

Para instalar o **Verus CLI** globalmente, execute o seguinte comando no terminal:

```bash
npm install -g verus-cli
```

---

## 🚀 Como Usar

1. **Adicione sua Chave de API**  
   Para configurar sua chave da OpenAI, use o comando:

   ```bash
   verus -k <apikey>
   ```

   Substitua `<apikey>` pela sua chave pessoal da OpenAI.

2. **Inicie o Verus CLI**  
   Para executar o Verus, digite:

   ```bash
   verus
   ```

---

## ▶️ Fluxo de Uso

1. **Seleção de Arquivos:** O Verus listará os arquivos modificados e você escolherá quais deseja incluir no commit.  
2. **Descreva suas Alterações:** Após selecionar os arquivos, escreva um breve resumo sobre o que foi feito.  
3. **Geração da Mensagem:** A IA da OpenAI processa o resumo e sugere uma mensagem de commit formatada, como:

   ```bash
   🧪 test(utils/date): added unit tests for formatDate function
   ```

4. **Commit Automático:** Após a confirmação, o Verus cria automaticamente o commit com a mensagem gerada. ✅

---

## 📝 Licença

Este projeto está licenciado sob a licença MIT.  
Sinta-se à vontade para usar, modificar e distribuir — apenas dê os devidos créditos. 🤝

Veja a licença completa no arquivo [LICENSE](./LICENSE).

---

## 🤝 Contribuições

Se quiser contribuir com o desenvolvimento do Verus, sinta-se à vontade para abrir um pull request ou relatar algum problema. 🚀
