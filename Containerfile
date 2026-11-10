FROM docker.io/library/node:26-slim AS build
WORKDIR /app
RUN npm install -g pnpm@10.33.4
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build && pnpm prune --prod

FROM docker.io/library/node:26-slim
ENV NODE_ENV=production \
    PORT=3000 \
    PRIVATE_DATABASE_PATH=/data/database
WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
RUN mkdir /data && chown node:node /data
USER node
VOLUME /data
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:' + process.env.PORT + '/').then(r => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]
CMD ["node", "build"]
