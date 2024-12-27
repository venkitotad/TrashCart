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
    const {email, password} = req.body;
    
    try{
      const result = await database.query('SELECT *FROM USERS WHERE email=$1 AND password=$2',
      [email, password]

      );

      if((await result).rows.length > 0){
        const userId = (await result).rows[0].id;
        console.log('user found', userId);
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
      }
      else{
        res.status(401).send('Invalid credentials. Please try again.');

      }
    }catch(err){
      res.status(500).send('Server error!.');
    }
});



app.get('/Schedule', (req, res) =>{
  res.render('schedule-pickup')
})

app.get('/Prices', (req, res) =>{
  res.render('rates')
})

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
