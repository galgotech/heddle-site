FROM node:24-alpine AS build

WORKDIR /app
RUN mkdir playground

COPY package.json package-lock.json ./
COPY playground/package.json playground/package-lock.json ./playground
RUN npm install \
    && cd playground && npm install

COPY . .
COPY playground ./playground

RUN npm run build \
    && cd playground && npm run build

FROM nginx:1.21.3-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/playground/dist /usr/share/nginx/html/playground
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

