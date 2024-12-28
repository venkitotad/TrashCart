import express from 'express';
import database from './db.js';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const port = 3000;
const app = express();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware setups
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/getStarted', (req, res) => {
  res.render('signup');
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));

});

app.get('/signup', (req, res) => {
  res.render('signup');
});




app.post('/register', async (req, res) => {
  const { username, phone, email, password } = req.body;
  console.log(username, phone, email, password);

  const result = await database.query(
    'INSERT INTO users (username, phone, email, password) values($1, $2, $3, $4) RETURNING id,username, phone, email, password',
    [username, phone, email, password]
  );

  const userId = result.rows[0].id;
  console.log(result.rows[0]);

  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));

});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await database.query('SELECT *FROM USERS WHERE email=$1 AND password=$2',
      [email, password]

    );

    if ((await result).rows.length > 0) {
      const userId = (await result).rows[0].id;
      console.log('user found', userId);
      res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    }
    else {
      res.status(401).send(`<h3>Invalid credentials. Please try again.</h3>`);

    }
  } catch (err) {
    res.status(500).send(`<h3>Server Error try again!.</h3>`);
  }
});


app.post('/schedule-pickup', async (req, res) => {
  try {

    const { weight, date, time, address, location } = req.body;

    const result = await database.query('INSERT INTO pickups(weight, date, time, address, location) VALUES ($1, $2, $3, $4, $5) RETURNING ID',

      [weight, date, time, address, location]
    );

    const pickupID = result.rows[0].id;
    console.log(`pickup id ${pickupID}`)

    res.status(200).send(`<h3>Pickup shceduled successfully id: is ${pickupID}</h3>`);

  } catch (err) {
    console.log(`Error scheduling pickup`, err);
    res.status(500).send(`<h3>Cannot schedule pickup!..please try again</h3>`);
  }
})



app.get('/Schedule', (req, res) => {
  res.render('schedule-pickup')
})

app.get('/Prices', (req, res) => {
  res.render('rates')
})

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
