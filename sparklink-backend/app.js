// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db'); // Import the database connection
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

// Routes
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const projectStatusRouter = require('./routes/projectStatusRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const projectRouter = require('./routes/projectRoutes');



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set `secure: true` if using HTTPS in production
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  console.log(`username: ${email}`);
  console.log(`password is : ${password}`)
  try {

    const user = await User.findOne({ where: { email } });
    if (!user) return done(null, false, { message: 'Incorrect email.' });
    console.log(`username is correct`);
    const isValidPassword = await user.validPassword(password.trim());
    console.log(`isValidPassword:${isValidPassword}`);
    if (!isValidPassword) return done(null, false, { message: 'Incorrect password.' });
    console.log(`password is correct`);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  console.log(`Inside Serialize User`);
  console.log(user);
  done(null, user.user_id);
}

);
passport.deserializeUser(async (user_id, done) => {
  console.log('Insidee Deserialize');
  try {
    const finduser = await User.findByPk(user_id);
    done(null, finduser);
  } catch (err) {
    done(err, null);
  }
});

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Define routes
app.use('/api/users', userRoutes);
app.use('/api', roleRoutes);
app.use('/projectstatus', projectStatusRouter);
app.use('/department', departmentRoutes);
app.use('/project', projectRouter);
// app.use('', userRouter);

// Login route
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      // Handle any authentication errors
      return res.status(500).json({ message: 'Authentication error', error: err });
    }
    if (!user) {
      // If no user is found or if the credentials are invalid
      return res.status(401).json({ message: info.message || 'Invalid credentials' });
    }

    // If authentication is successful
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login failed', error: err });
      }

      // Send a response back to the client
      return res.status(200).json({ message: 'Login successful', user });
    });
  })(req, res, next);
});

// Logout route
app.post('/logout', (req, res) => {
  console.log("in logout");
  
  if (!req.user) {
    // Check if the user is authenticated
    return res.status(401).json({ message: 'User not logged in' });
  }

  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error while logging out', error: err });
    }
    
    // Successful logout
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error while destroying session', error: err });
      }

      return res.status(200).json({ message: 'Logged out successfully' });
    });
  });
});


// Protect routes - example middleware
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Protected route example
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.send('Welcome to the dashboard!');
});

app.get("/status",(req,res) => {
  console.log(`Inside status end point`);
  console.log(req.user);
  console.log(req.session);
  return req.user? res.send(req.user) : res.sendStatus(401);
});

// Start the server
const PORT =  5100;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

