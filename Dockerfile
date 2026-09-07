# Multi-stage: the build toolchain and devDependencies never reach the runtime image.
FROM node:lts-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Next needs these at build time for any statically evaluated route; they are re-supplied at
# runtime by the platform. Placeholders keep the build from failing on their absence.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:lts-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as a non-root user. The base image ships `node` (uid 1000) for exactly this.
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]
