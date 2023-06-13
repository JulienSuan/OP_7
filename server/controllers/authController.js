const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken")


exports.auth = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization.split("Bearer ")[1];
    if (!token) {
      return next(new AppError("Token non fourni", 401));
    }
  
    jwt.verify(token, process.env.JWT, function(err, decoded) {
      if (err) {
          return next(new AppError("Token non valide", 401));
      }
      req.body.userId = decoded.id;
      next();
    });
  });
  