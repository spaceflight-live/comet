import { generateOpenApiDocument } from 'trpc-openapi';

import { appRouter } from '@server/routers/_app';

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'Spaceflight Live Public API',
  description: `Get information about missions to space`,
  version: '1.0.0',
  baseUrl:
    process.env.NODE_ENV !== 'production'
      ? `http://localhost:${process.env.PORT ?? 3000}/api`
      : 'https://spaceflight.live/api',
});
