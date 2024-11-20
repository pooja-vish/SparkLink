// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db'); // Import the database connection
const passport = require('./config/passportConfig'); 
const session = require('express-session');


const User = require('./models/user');

// Routes
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const projectStatusRouter = require('./routes/projectStatusRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const projectRouter = require('./routes/projectRoutes');
const profileRouter = require('./routes/profileRoutes');
const projApplicationRouter = require('./routes/projectApplicationRoutes');
const projAllocationRouter = require('./routes/projectAllocationRoutes');
//const userRouter = require('./routes/userRoutes');
const progressTrackerRouter = require('./routes/progressTrackerRoutes');

const app = express();

// Middleware
const corsOptions = {
  origin: 'http://localhost:3100', // Specify the frontend origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));
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
// passport.use(new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password'
// }, async (email, password, done) => {
//   console.log(`username: ${email}`);
//   console.log(`password is : ${password}`)
//   try {

//     const user = await User.findOne({ where: { email } });
//     if (!user) return done(null, false, { message: 'Incorrect email.' });
//     console.log(`username is correct`);
//     const isValidPassword = await user.validPassword(password.trim());
//     console.log(`isValidPassword:${isValidPassword}`);
//     if (!isValidPassword) return done(null, false, { message: 'Incorrect password.' });
//     console.log(`password is correct`);
//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// }));

// // Serialize and deserialize user for session management
// passport.serializeUser((user, done) => {
//   console.log(`Inside Serialize User`);
//   console.log(user);
//   done(null, user.user_id);
// }

// );
// passport.deserializeUser(async (user_id, done) => {
//   console.log('Insidee Deserialize');
//   try {
//     const finduser = await User.findByPk(user_id);
//     done(null, finduser);
//   } catch (err) {
//     done(err, null);
//   }
// });

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
app.use('/api/users', userRoutes); // Route for user-related requests
app.use('/api', roleRoutes); // Route for role-related requests
app.use('/projectstatus', projectStatusRouter);
app.use('/department', departmentRoutes);
app.use('/project', projectRouter);
app.use('/profile', profileRouter);
//app.use('',userRouter);
app.use('/progressTracker', progressTrackerRouter);
// Error handling middleware


function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    // Store the path the user tried to access
   return  res.status(200).json({ isAuthenticated: false });
  }
  
// Define routes
app.use('/api/users', userRoutes);
app.use('/api', roleRoutes);
app.use('/projectstatus',isAuthenticated,projectStatusRouter);
app.use('/department', isAuthenticated,departmentRoutes);
app.use('/project',projectRouter);
app.use('/apply', projApplicationRouter);
app.use('/alloc', projAllocationRouter);




// // Protect routes - example middleware
// function isAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.redirect('/login');
// }

// // Protected route example
// app.get('/dashboard', isAuthenticated, (req, res) => {
//   res.send('Welcome to the dashboard!');
// });

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

