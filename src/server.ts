import fastify from 'fastify'
import { knex } from './database'
import { ITransactions } from './@types'
import crypto from 'node:crypto'

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
    port: 3333,
  })
  .then(() => console.log('HTTP Server Running!'))
