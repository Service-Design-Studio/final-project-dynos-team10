FROM node:16.15.1-alpine as build
ENV NODE_ENV production

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .
RUN npm run build

FROM nginx:1.21-alpine as production
ENV NODE_ENV production

# copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html
# add nginx.conf
COPY nginx.conf /etc/nginx.conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]