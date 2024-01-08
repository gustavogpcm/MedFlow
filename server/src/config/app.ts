import { FastifyInstance, fastify } from 'fastify'
import cors from '@fastify/cors'

import { healthCheck } from '../modules/healthCheck/healthCheckRoutes'
import { promptuary } from '../modules/promptuary/promptuaryRoutes'

const app: FastifyInstance = fastify()
const apiPort = Number(process.env.PORT)

app.register(cors, {
  origin: true,
})

app.register(healthCheck)
app.register(promptuary)

app
  .listen({
    port: apiPort,
  })
  .then(() => {
    console.log(`HTTP server running on http://localhost:${apiPort}`)
  })
