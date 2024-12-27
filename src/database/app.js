
import express from 'express';
import mysql from 'mysql2';

const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Barcellona2019',
  database: 'popverso'
});


db.connect(err => {
  if (err) {
    console.error('Errore di connessione al database:', err);
    return;
  }
  console.log('Connesso a MySQL');
});

//INDEX 

// characters
app.get('/characters', (req, res) => {
  db.query('SELECT * FROM characters', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Errore nel recupero dei dati', error: err });
    }
    res.json(results);
  });
});

// teams
app.get('/teams', (req, res) => {
  db.query('SELECT * FROM teams', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Errore nel recupero dei dati', error: err });
    }
    res.json(results);
  });
});


// team components
app.get('/teams/members', (req, res) => {
  db.query(
    `SELECT teams.name AS team_name,
    characters.id, characters.name, characters.age, characters.shadow, characters.description,
    GROUP_CONCAT(abilities.name) AS abilities
    FROM characters
    JOIN character_teams ON characters.id = character_teams.character_id
    JOIN teams ON character_teams.team_id = teams.id
    LEFT JOIN abilities ON characters.id = abilities.character_id
    GROUP BY teams.name, characters.id`, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Errore nel recupero dei dati', error: err });
    }
    res.json(results);
  });
});

//SHOW 

// character
app.get('/characters/:id', (req, res) => {
  const charId = req.params.id
  db.query('SELECT * FROM characters WHERE id = ?', [charId], (err, results) => {
    if (results.length === 0) {
      return res.status(404).json('Nessun personaggio trovato!')
    }
    res.json(results)
  }
  )
})



app.listen(3000, () => {
  console.log('Server in esecuzione su http://localhost:3000');
});
