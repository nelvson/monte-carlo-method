import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
const app: express.Application = express();

const initiate = async () => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors())

  app.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:${4000}`);
  });

  app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200);
    res.send('it works!');
  });

  app.get('/generatePoints', (req: express.Request<{}, {}, {}, { numberOfPoints: number }>, res: express.Response) => {
    const { numberOfPoints } = req.query;

    if (Number.isNaN(Number(numberOfPoints))) {
      res.status(400).json({
        status: 'Error',
        data: [],
        message: 'Number of Points should be a number'
      });
    }

    let data: Array<{ x: number, y: number }> = [];
    if (numberOfPoints < 1) {
      res.status(400).json({
        status: 'Error',
        data: [],
        message: 'Number of Points cannot be less than 1'
      });
    } else {

      for (let i = 0; numberOfPoints > i; i++) {
        let pointX = Math.random();
        let pointY = Math.random();

        data.push({
          x: pointX,
          y: pointY
        })
      }

      res.status(200).json({
        status: 'Success',
        data,
        message: '',
      });
    }
  });
};

initiate();
