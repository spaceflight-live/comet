import { NextApiRequest, NextApiResponse } from 'next';

import { openApiDocument } from '@server/openapi';

export default (req: NextApiRequest, res: NextApiResponse) =>
  res.status(200).send(openApiDocument);
