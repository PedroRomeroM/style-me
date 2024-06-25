# Usa a imagem oficial do Node como base
FROM node:alpine

# Cria e define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todo o conteúdo do diretório local para o diretório de trabalho no contêiner
COPY . .

# Compila o código de produção (se necessário)
RUN npm run build

# Expõe a porta 3000 para que a aplicação possa ser acessada externamente
EXPOSE 3000

# Comando para iniciar a aplicação quando o contêiner for iniciado
CMD ["npm", "start"]
