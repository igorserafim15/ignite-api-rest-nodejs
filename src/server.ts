import fastify from 'fastify'
import { knex } from './database'
import { ITransactions } from './@types'
import crypto from 'node:crypto'
import { env } from './env'

const app = fastify()

app.get('/', async () => {
  const transactions = await knex('transactions')
    .insert<ITransactions>({
      id: crypto.randomUUID(),
      title: 'Transações de teste',
      amount: 1000,
    } as ITransactions)
    .returning('*')

  return transactions
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('HTTP Server Running!'))
