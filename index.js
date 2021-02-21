const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

//const dotenv = require('dotenv');
const colors = require('colors');

require('./models/User');
require('./models/Blog');
require('./services/passport');
require('./services/cache');

//mongoose.Promise = global.Promise;
//mongoose.connect(keys.mongoURI, { useNewUrlParser: true,  useCreateIndex: true,  useFindAndModify: false}) //useMongoClient: true });  /*{
  //dotenv.config()

  const connectDB = async () => {
    try { 
      const conn = await mongoose.connect(keys.mongoURI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      })
  
      console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
    } catch (error) {
      console.error(`Error: ${error.message}`.red.underline.bold)
      process.exit(1)
    }
  }
  
  connectDB()

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);
require('./routes/uploadRoutes')(app);

if (['production'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port`, PORT);
});
