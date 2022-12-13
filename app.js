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
//var process = spawn('python', ['./htltg.py']);


// Route for displaying the admin leaderboard page
app.get('/admin', (req, res) => {

  // Handle auth
  const reject = () => {
    res.setHeader("www-authenticate", "Basic");
    res.sendStatus(401);
  };

  const authorization = req.headers.authorization;

  if (!authorization) {
    return reject();
  }

  const [username, password] = Buffer.from(
    authorization.replace("Basic ", ""),
    "base64"
  )
    .toString()
    .split(":");

  // Hardcoded because who cares i dont need a real auth system just keep away the biggest golems
  if (!(username === "admin" && password === "tgclan420")) {
    return reject();
  }

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

    // Now get the articles
    // Read the articles.json file
    fs.readFile('articles.json', (err, data) => {
      if (err) throw err;

      // Parse the JSON data and pass the list of articles to the view
      const articles = JSON.parse(data);

      // Render the leaderboard page and pass the players data and custom articles to the template
      res.render('index', { players: sortedPlayers, articles: articles });
    });

    
  });
});


// Public page
// Route for displaying the public leaderboard
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

    // Now get the articles
    // Read the articles.json file
    fs.readFile('articles.json', (err, data) => {
      if (err) throw err;

      // Parse the JSON data and pass the list of articles to the view
      const articles = JSON.parse(data);

      // Render the leaderboard page and pass the players data and custom articles to the template
      res.render('index2', { players: sortedPlayers, articles: articles });
    });
  });
});


// Route for handling the form submission for new articles
app.post('/submit', (req, res) => {
  // Read the players.json file
  fs.readFile('players.json', 'utf8', (err, data) => {
    if (err) throw err;

    // Parse the JSON data
    const articles = JSON.parse(data);
    // Format the article data
    articles.push = {
      title: req.body.title,
      author: req.body.author,
      content: req.body.content,
      date: new Date()
    };

  // Save the article to the JSON file
  fs.writeFile('articles.json', JSON.stringify(article), (err) => {
    if (err) throw err;
    console.log('Article saved successfully!');
  });

  res.redirect('/');
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