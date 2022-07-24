import { FC } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const Docs: FC = () => <SwaggerUI url="/api/openapi.json" />;

export default Docs;
