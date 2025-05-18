FROM node:20.11.0

WORKDIR /app/frontend

COPY ./package.json ./
RUN yarn install

COPY . .

EXPOSE 5173 24678
CMD ["yarn", "dev"]