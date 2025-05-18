FROM node:20.11.0

WORKDIR /app/db

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["node", "index.js"]