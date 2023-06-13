module.exports = (err, req, res , next) => {

    console.log(err)
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (err.message === "User validation failed: password: Il faut au moins 8 caractères") {
        err.message = "Vous devez avoir un mot de passe d'au moins 8 caractères"
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
}