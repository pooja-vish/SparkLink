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
const EditProfileRouter = require('./routes/editProfileRoute');
const projApplicationRouter = require('./routes/projectApplicationRoutes');
const projAllocationRouter = require('./routes/projectAllocationRoutes');
//const userRouter = require('./routes/userRoutes');
const progressTrackerRouter = require('./routes/progressTrackerRoutes');
const notificationRouter = require("./routes/notificationRoutes");

const app = express();



const allowedOrigins = [
  'http://localhost:3100', // React frontend
  'http://10.0.2.2:5100', // Flutter emulator
  'http://localhost:5100/',
  'http://localhost:5100',
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log('Incoming Origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow
    } else {
      console.error('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies or authentication headers
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false , sameSite: 'Lax'} // Set `secure: true` if using HTTPS in production
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/editProfile', EditProfileRouter);
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
app.use('/profile', profileRouter);
app.use('/editProfile', EditProfileRouter);
app.use('/apply', projApplicationRouter);
app.use('/alloc', projAllocationRouter);
app.use('/notify', notificationRouter);





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

