const express = require("express")
const userController = require("../controllers/userController")


const router = express.Router()


router.post("/api/auth/signup", userController.signup)
router.post("/api/auth/login", userController.signin)




module.exports = router