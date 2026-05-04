# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build
RUN npx tsc server.ts --outDir dist-server --module nodenext --target es2022 --moduleResolution nodenext --esModuleInterop --skipLibCheck

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/dist-server/server.js ./server.js

EXPOSE 3000
CMD ["node", "server.js"]
