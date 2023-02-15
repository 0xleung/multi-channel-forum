FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
RUN npm install pm2@latest --global
EXPOSE 3000
CMD ["pm2-runtime", "ecosystem.config.js"]