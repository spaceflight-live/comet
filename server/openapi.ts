import { generateOpenApiDocument } from 'trpc-openapi';

import { appRouter } from '@server/routers/_app';

const description = `
Get information about missions to space

**This API is still under development and subject to breaking changes.**
`;

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'Spaceflight Live Public API',
  description,
  version: 'development',
  baseUrl:
    process.env.NODE_ENV !== 'production'
      ? `http://localhost:${process.env.PORT ?? 3000}/api`
      : 'https://spaceflight.live/api',
});
