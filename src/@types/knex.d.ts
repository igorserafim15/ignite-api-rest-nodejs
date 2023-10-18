// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

import { ITransactions } from '.'

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: ITransactions
  }
}
