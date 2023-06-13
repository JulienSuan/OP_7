const express =  require("express")
const path = require('path');
const cors = require('cors')
require("dotenv").config({path: ".env"})
/////////////////////////////
const userRoutes = require("./routes/userRoutes")
const bookRoutes = require("./routes/bookRoutes")
const coMongo = require ("./utils/connexionMongo")
const errorController = require("./controllers/errorController")

const app = express()
const port = 4000

// Connexion Mongo 🖥
coMongo()
////////////////////
 
  app.use(cors());
  app.use(express.json());
  app.use('/public', express.static(path.join(__dirname, 'public')));
  
  ////////////////////////
  // Routes 🚗🚕
  app.use(userRoutes)
  app.use(bookRoutes)
  ///////////////////
  
  app.use(errorController)


// Launch Server! 🌍
app.listen(port, () => {
    console.log("server started at: http://localhost:" + port + " 🟢")
})
////////////////////////////////////////////////////////////////////////


