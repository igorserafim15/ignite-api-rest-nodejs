import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    const bodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const body = bodySchema.parse(request.body)

    await knex('transactions').insert({
      id: randomUUID(),
      title: body.title,
      amount: body.type === 'credit' ? body.amount : body.amount * -1,
    })

    return response.status(201).send()
  })
}
