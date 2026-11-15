# ---- Build stage: typecheck + bundle the static site ----
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies first so this layer caches independently of source edits
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# .env is dockerignored; forward the contact endpoint explicitly if configured
ARG VITE_CONTACT_ENDPOINT=""
ENV VITE_CONTACT_ENDPOINT=${VITE_CONTACT_ENDPOINT}
RUN npm run build

# ---- Serve stage: nginx with only the built output ----
FROM nginx:alpine AS serve
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]