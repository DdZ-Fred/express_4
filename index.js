const express = require('express');
const _ = require('lodash');
const engines = require('consolidate');
const fs = require('fs');


const app = express();
let users;

// Init users array
fs.readFile('users.json', 'utf8', (err, data) => {
  if (err) {
    throw err;
  }

  users = JSON.parse(data).map((user) => Object.assign(
    {},
    user,
    {
      name: {
        title: user.name.title,
        first: user.name.first,
        last: user.name.last,
        full: _.startCase(`${user.name.first} ${user.name.last}`),
      },
    }
  ));
});

app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');


// Define/Configure access to static assets
app.use('/profilepics', express.static('images'));

app.get('/', (req, res) => {
  res.render('index', {
    users,
  });
});

app.get('/:username', ({ params }, res) => {
  res.render('user', {
    username: params.username,
  });
});


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is listening on localhost:${PORT}`);
});
