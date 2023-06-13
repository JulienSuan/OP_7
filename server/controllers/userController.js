const AppError = require("../utils/appError.js")
const User = require("../models/User.js")
const jwt = require("jsonwebtoken")
const catchAsync = require("../utils/catchAsync.js")


exports.signin = catchAsync(async (req, res, next) => {
        
    const { email, password } = req.body;     
    const user = await User.findOne({ email });   

    if (!user) {
     return next(new AppError("Je ne trouve pas l'utilisateur", 404))
    }
  
    const correct = await user.correctPassword(password, user.password);
  
    if (!correct) {
     return next(new AppError("Mot de passe incorrect", 404)) 
    }

    const token = jwt.sign({id: user._id}, process.env.JWT, {expiresIn: "30d"})
  
    console.log("Vous êtes connecté ! 🟢");
    res.status(200).json({
    userId: user._id,
    token: token,
      message: "Vous êtes connecté avec l'email : " + user.email,
    });
})
  

exports.signup = catchAsync(async(req, res, next) => {

        const {email} = req.body;
        const user = await User.find({email: email})  

        if (user[0]) {
            return next(new AppError("Email déjà utilisé", 404)) 
        }

        const token = jwt.sign({id: user._id}, process.env.JWT, {expiresIn: "30d"})    
        const createUser = new User(req.body)
        await createUser.save()

        if (createUser) {
            res.status(201).json({
                status: "ok",
                token: token,
                message: "Vous venez de créer votre Utilisateur",
                User: createUser
            })
    }

})