import app from './app';
import logger from '../../logger';

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
  logger.info(`Server is up on port ${port}`);
});
