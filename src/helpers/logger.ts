import winston from 'winston';
import { Timber } from '@timberio/node';
import { TimberTransport } from '@timberio/winston';

const timber = new Timber(
  process.env.TIMBER_API_KEY as string,
  process.env.TIMBER_SOURCE_ID as string,
);

export const logger = winston.createLogger({
  transports: [new TimberTransport(timber), new winston.transports.Console()],
});
