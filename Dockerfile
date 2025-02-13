ARG IMAGE=node:23.7-alpine

FROM ${IMAGE} as builder

WORKDIR /app

COPY .env .env

COPY  . .

RUN npm i

FROM builder as dev
CMD [ "" ]

FROM builder as prod-build
RUN npm run build
RUN npm prune --production

FROM ${IMAGE} as prod
COPY --chown=node:node --from=prod-build /app/dist /app/dist
COPY --chown=node:node --from=prod-build /app/node_modules /app/node_modules
COPY --chown=node:node --from=prod-build /app/.env /app/.env

ENV NODE_ENV=production
ENTRYPOINT [ "node", "-r", "dotenv/config", "./main.js" ]

WORKDIR /app/dist
CMD [ "" ]

USER node