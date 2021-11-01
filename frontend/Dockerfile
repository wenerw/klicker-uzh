# extend the node alpine base
# check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
FROM node:14.18.1-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci


# extend the node alpine base
FROM node:14.18.1-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build && npm install --production --ignore-scripts --prefer-offline
RUN ls -la /app


FROM node:14.18.1-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# install tini
RUN apk add --no-cache tini

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/dist/next.config.js ./
COPY --from=builder /app/dist/compiled-lang ./
COPY --from=builder /app/dist/polyfills.js ./
COPY --from=builder /app/dist/sentry.client.config.js ./
COPY --from=builder /app/dist/sentry.server.config.js ./
COPY --from=builder /app/dist/server.js ./

# switch to the node user (uid 1000)
# non-root as provided by the base image
USER nextjs

# run next in production mode
ENTRYPOINT ["/sbin/tini", "--"]
CMD "cross-env NODE_ENV=production NODE_ICU_DATA=node_modules/full-icu node -r dotenv/config server"

# add labels
ARG VERSION="canary"
LABEL maintainer="Roland Schlaefli <roland.schlaefli@bf.uzh.ch>"
LABEL name="@klicker-uzh/frontend"
LABEL version=$VERSION

# expose the main application port
EXPOSE 3000

# setup a HEALTHCHECK
HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://localhost:3000/ || exit 1
