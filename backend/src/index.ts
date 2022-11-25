import express from 'express';
import bodyParser from 'body-parser';
const app: express.Application = express();

const initiate = async () => {
  app.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:${4000}`);
  });

  app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200);
    res.send('it works!');
  });

};

initiate();
