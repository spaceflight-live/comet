import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const createFilterZod = (filterable: readonly [string, ...string[]]) =>
  z
    .string()
    .transform((filter) => {
      const filters = filter
        .split(',')
        .map((s) => s.replace(/\s+/g, ' ').trim().split(' '));

      return filters.map(([field, operation, ...value]) =>
        z
          .object({
            field: z.enum(filterable),
            operation: z.enum(Operators),
            value: z
              .string()
              .or(z.number())
              .transform((arg) => {
                if (typeof arg == 'string' && arg.toUpperCase() == 'NOW()')
                  return new Date();
                return arg;
              }),
          })
          .parse({
            field,
            operation: operation as typeof Operators[number],
            value: value.join(' '),
          }),
      );
    })
    .optional();

export const whereFilter = (
  filters?: {
    field: string;
    operation: typeof Operators[number];
    value: string | Date | number;
  }[],
) =>
  Object.assign(
    {},
    ...(filters?.map(({ field, operation, value }) => ({
      [field]: {
        [OperatorPairs[operation]]: value,
      },
    })) || []),
  );

export const Operators = [
  'contains',
  'endsWith',
  'startsWith',
  '=',
  '==',
  'eq',
  '>',
  'gt',
  '>=',
  'gte',
  '<',
  'lt',
  '<=',
  'lte',
  '!=',
  'not',
] as const;

export const OperatorPairs: Record<
  typeof Operators[number],
  keyof Prisma.DateTimeNullableFilter | keyof Prisma.StringFilter
> = {
  contains: 'contains',
  endsWith: 'endsWith',
  startsWith: 'startsWith',
  '=': 'equals',
  '==': 'equals',
  eq: 'equals',
  '>': 'gt',
  gt: 'gt',
  '>=': 'gte',
  gte: 'gte',
  '<': 'lt',
  lt: 'lt',
  '<=': 'lte',
  lte: 'lte',
  '!=': 'not',
  not: 'not',
};
