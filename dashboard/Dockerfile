# build step
FROM node:16.15.1-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production step
FROM nginx:1.21-alpine as production
# add nginx.conf
COPY nginx.conf /etc/nginx/conf.d/configfile.template
# copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

ENV PORT 8080
ENV HOST 0.0.0.0
EXPOSE 8080
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"