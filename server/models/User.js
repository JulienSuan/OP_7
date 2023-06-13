const mongoose = require("mongoose")
const validator = require('validator');
const bcrypt = require("bcrypt")
const uniqueValidator = require("mongoose-unique-validator")

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Vous devez entrer un mail valide"],
        validate: [validator.isEmail, "Vous devez rentrer un mail valide"]
    },
    password: {
        type: String,
        required: [true, "Vous devez rentrer un mot de passe valide"],
        minLength: [8, "Il faut au moins 8 caractères"]
    }
})


UserSchema.plugin(uniqueValidator)

UserSchema.pre("save",  async function(next) {   
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 12);
    next()  
})




UserSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, userPassword);
    return isMatch;
  } catch (error) {
    throw new Error(error);
  }
};



const User = mongoose.model("User", UserSchema)
module.exports = User