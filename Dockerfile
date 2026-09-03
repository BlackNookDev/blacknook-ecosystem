FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_OAUTH
ARG NEXT_PUBLIC_CODER_URL
ARG NEXT_PUBLIC_ENABLE_DEV_AUTO_LOGIN
ARG NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH
ARG NEXT_PUBLIC_OTONOM_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_OAUTH=$NEXT_PUBLIC_GOOGLE_OAUTH
ENV NEXT_PUBLIC_CODER_URL=$NEXT_PUBLIC_CODER_URL
ENV NEXT_PUBLIC_ENABLE_DEV_AUTO_LOGIN=$NEXT_PUBLIC_ENABLE_DEV_AUTO_LOGIN
ENV NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH=$NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH
ENV NEXT_PUBLIC_OTONOM_APP_URL=$NEXT_PUBLIC_OTONOM_APP_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN apk add --no-cache postgresql-client wget su-exec

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && mkdir -p /app/uploads \
  && chown nextjs:nodejs /app/uploads

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs schema.sql ./schema.sql
COPY --chown=nextjs:nodejs migrations ./migrations
COPY --chown=nextjs:nodejs scripts ./scripts
COPY --chown=nextjs:nodejs docker/entrypoint.sh ./docker/entrypoint.sh

RUN chmod +x ./docker/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker/entrypoint.sh"]
