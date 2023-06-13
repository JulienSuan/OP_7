const {connect} = require("mongoose")


module.exports = coMongo = async() => {
    const con = await connect(`mongodb+srv://Julien:${process.env.PASSWORD_MONGO}@ocprojet7.koyzxxp.mongodb.net/?retryWrites=true&w=majority`)
    if (con) {
        console.log("connected to database ! ✨")
    }  
}




