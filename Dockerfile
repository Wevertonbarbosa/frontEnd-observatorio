# Etapa 1: Construção da imagem
FROM node:18 AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./ 

# Instalar dependências
RUN npm install

# Copiar o restante dos arquivos
COPY . . 

# Gerar a build da aplicação
RUN npm run build

# Etapa 2: Execução da aplicação
FROM node:18

WORKDIR /app

# Copiar as dependências e a build da etapa anterior
COPY --from=builder /app ./ 

# Expôr a porta 3000 (padrão do Next.js)
EXPOSE 3000

# Iniciar a aplicação
CMD ["npm", "start"]
