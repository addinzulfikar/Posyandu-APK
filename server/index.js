const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { buildRoutes } = require('./routes');

const PORT = Number(process.env.PORT || 3001);

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.use('/api', buildRoutes());

app.get('/', (req, res) => {
  res.type('text').send('Posyandu Digital API. See /api/health');
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Posyandu Digital API running on http://localhost:${PORT}`);
});
