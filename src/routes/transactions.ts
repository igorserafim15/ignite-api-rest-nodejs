import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id'

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkSessionIdExists)

  app.get('/', async (request) => {
    const sessionId = request.cookies['ignite.sessionId']

    const transactions = await knex('transactions')
      .select('*')
      .where('session_id', sessionId)

    return { transactions }
  })

  app.get('/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const params = paramsSchema.parse(request.params)

    const sessionId = request.cookies['ignite.sessionId']

    const transaction = await knex('transactions')
      .where('id', params.id)
      .andWhere('session_id', sessionId)
      .first()

    return { transaction }
  })

  app.get('/summary', async (request) => {
    const sessionId = request.cookies['ignite.sessionId']

    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .where('session_id', sessionId)
      .first()

    return { summary }
  })

  app.post('/', async (request, response) => {
    const bodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const body = bodySchema.parse(request.body)

    let sessionId = request.cookies['ignite.sessionId']

    if (!sessionId) {
      sessionId = randomUUID()
      response.cookie('ignite.sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title: body.title,
      amount: body.type === 'credit' ? body.amount : body.amount * -1,
      session_id: sessionId,
    })

    return response.status(201).send()
  })
}
