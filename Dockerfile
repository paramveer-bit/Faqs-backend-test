FROM node:18

WORKDIR /app

COPY package.json package-lock.json  tsconfig.json ./

RUN npm install

COPY src ./src

RUN npm run build

EXPOSE 3000
EXPOSE 587

CMD ["npm","run","dev"]