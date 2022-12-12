const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const {spawn} = require('child_process');

// Set the view engine
app.set('view engine', 'ejs');

// Use body-parser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + './views'));
app.use(express.static("public"));
app.use(bodyParser.json());

//PYTHON BOT//>
var process = spawn('python', ['./htltg.py']);


// Route for displaying the leaderboard
app.get('/', (req, res) => {
  //JSON STATS//>
  // Read the players.json file
  fs.readFile('players.json', 'utf8', (err, data) => {
    if (err) throw err;

    // Parse the JSON data
    const players = JSON.parse(data);
    // Calculate the total score for each player
    players.forEach(player => {
      player.totalScore = player.qui + player.feur + player.ratio + player.l;
    });
    // Sort the players by their total score in descending order
    const sortedPlayers = players.sort((a, b) => b.totalScore - a.totalScore);
    // Render the leaderboard page and pass the players data to the template
    res.render('index', { players: sortedPlayers });
  });
});

// Route for handling the form submission when a new player is added to the leaderboard
app.post('/add-player', (req, res) => {
  // Read the players.json file
  fs.readFile('players.json', 'utf8', (err, data) => {
    if (err) throw err;

    // Parse the JSON data
    const players = JSON.parse(data);

    // Add the new player to the list of players
    players.push({
      name: req.body.name,
      qui: 0,
      feur: 0,
      ratio: 0,
      l: 0
    });

    // Write the updated list of players back to the players.json file
    fs.writeFile('players.json', JSON.stringify(players), 'utf8', err => {
      if (err) throw err;

      // Redirect the user back to the leaderboard page
      res.redirect('/');
    });
  });
});


// Handle the POST request to the /update-score endpoint
app.post('/update-score', (req, res) => {
  // Read the players data from the JSON file
  const players = JSON.parse(fs.readFileSync('players.json'));

  // Find the player with the specified ID in the players array
  const player = players.find(player => player.name === req.body.name);

  console.log(req.body);


  // Update the player's score for the specified stat
  if (req.body.action === 'increment') {
    player[req.body.stat]++;
  } else if (req.body.action === 'decrement') {
    player[req.body.stat]--;
  }

  // Update the player's total score
  player.totalScore = player.qui + player.feur + player.ratio + player.l;

  // Write the updated players data to the JSON file
  fs.writeFileSync('players.json', JSON.stringify(players, null, 2));

  // Redirect the user back to the leaderboard page
  res.redirect('/');
});

// Start the server on port 3000
app.listen(5000, () => {
  console.log('Server listening on port 5000');
});