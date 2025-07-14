<p align="center">
  <a href="https://github.com/euandresimoes/verus">
      <img src="https://img.shields.io/badge/🚀-REPO-FFE162?style=for-the-badge&labelColor=000000"/>
  </a>
  &nbsp;&nbsp;
  <a href="https://www.npmjs.com/package/verus-cli">
    <img src="https://img.shields.io/npm/v/verus-cli?label=%F0%9F%93%A6+NPM&labelColor=black&color=%233F0071&style=for-the-badge"/>
  </a>
  &nbsp;&nbsp;
  <img src="https://img.shields.io/github/stars/euandresimoes/verus?style=for-the-badge&label=%E2%AD%90%20STARS&labelColor=black&color=%23FB2576"/>
  &nbsp;&nbsp;
  <img src="https://img.shields.io/github/repo-size/euandresimoes/verus?style=for-the-badge&label=%F0%9F%9B%A0%EF%B8%8F%20SIZE&labelColor=black&color=%23332FD0"/>
</p>

![Verus Banner](https://github.com/user-attachments/assets/5173589a-5dd8-4fd4-9536-7e039365acae)

# 📦 Verus CLI - El Asistente de Commits Potenciado por IA

[🇺🇸 EN](https://github.com/euandresimoes/verus/blob/master/README.md) | [🇪🇸 ES](https://github.com/euandresimoes/verus/blob/master/README.es.md) | [🇧🇷 PT-BR](https://github.com/euandresimoes/verus/blob/master/README.pt-br.md) 

**Verus** es una herramienta CLI que usa inteligencia artificial para crear automáticamente mensajes de commit en Git, basándose en una breve descripción de los cambios., como por ejemplo:

`✨ feat(auth/signup): implemented email verification`

---

## 📋 Requisitos

Para usar **Verus**, necesitas una clave de API de **OpenAI** con al menos **$0.50 de crédito**.

---

## 💻 Instalación

Para instalar **Verus CLI globalmente**, ejecuta el siguiente comando en tu terminal:

```bash
npm install -g verus-cli
```

---

## 🚀 Cómo usar

1. **Agrega tu clave API**  
   Para configurar tu clave de API de **OpenAI**, usa el siguiente comando:

   ```bash
   verus -k <apikey>
   ```

   Reemplaza `<apikey>` con tu clave personal de OpenAI.

3. **Inicia Verus CLI**  
   Para ejecutar Verus, simplemente escribe el siguiente comando:

   ```bash
   verus
   ```

---

## ▶️ Flujo de Uso

1. **Selección de archivos:** Verus mostrará los archivos modificados y podrás seleccionar los que deseas incluir en el commit. 
2. **Describe tus cambios:** Después de seleccionar los archivos, proporciona un breve resumen de los cambios realizados.
3. **Generación del mensaje de commit:** La IA de OpenAI procesa el resumen y sugiere un mensaje de commit con formato, como por ejemplo:

   ```bash
   🧪 test(utils/date): added unit tests for formatDate function
   ```

4. **Commit listo:** Una vez confirmado, Verus crea automáticamente el commit con el mensaje generado.

---

## 📝 Licencia

Este proyecto está bajo la licencia MIT.
Siéntete libre de usarlo, modificarlo y distribuirlo como desees, solo da el crédito correspondiente. 🤝

Consulta la licencia completa en el archivo [LICENSE](./LICENSE).

---

## 🤝 Contribuciones

No dudes en abrir un pull request o reportar problemas si deseas contribuir al desarrollo de Verus. 🚀
