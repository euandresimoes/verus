<p align="center">
  <a href="https://github.com/euandresimoes/verus">
      <img src="https://img.shields.io/badge/🚀-REPO-FFE162?style=for-the-badge&labelColor=000000"/>
  </a>
  <a href="https://www.npmjs.com/package/verus-cli">
    <img src="https://img.shields.io/npm/v/verus-cli?label=%F0%9F%93%A6+NPM&labelColor=black&color=%233F0071&style=for-the-badge"/>
  </a>
  &nbsp;&nbsp;
  <img src="https://img.shields.io/github/stars/euandresimoes/verus?style=for-the-badge&label=%E2%AD%90%20STARS&labelColor=black&color=%23FB2576"/>
  &nbsp;&nbsp;
  <img src="https://img.shields.io/github/repo-size/euandresimoes/verus?style=for-the-badge&label=%F0%9F%9B%A0%EF%B8%8F%20SIZE&labelColor=black&color=%23332FD0"/>
</p>

![Verus Banner](https://github.com/user-attachments/assets/5173589a-5dd8-4fd4-9536-7e039365acae)

# 📦 Verus CLI - O Assistente de Commits com IA

[🇺🇸 EN](https://github.com/euandresimoes/verus/blob/master/README.md) | [🇪🇸 ES](https://github.com/euandresimoes/verus/blob/master/README.es.md) | [🇧🇷 PT-BR](https://github.com/euandresimoes/verus/blob/master/README.pt-br.md) 

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
