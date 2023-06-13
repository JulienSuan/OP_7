const multer = require('multer');
const path = require("path")
const fs = require("fs")
const sharp = require("sharp")


// const storage = multer.diskStorage({
  
//     destination: function async(req, file, cb) {
//         const imageDir = path.join(__dirname, '..', 'public', 'images', JSON.parse(req.body.book).userId);     
//         fs.mkdirSync(imageDir, { recursive: true });
//         cb(null, imageDir); 
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + file.originalname); 
//       }
//     });

const storage = multer.memoryStorage();
module.exports.upload = multer({ storage: storage });
module.exports.resize = async (req, res, next) => {
    if (!req.file) {
      next();
      return;
    }
    let userId;
    try {
      userId = JSON.parse(req.body.book ?? '{}').userId;
    } catch (error) {
      console.error('Erreur de parsing JSON :', error);
      next();
      return;
    }  
    const imageDir = path.join(__dirname, '..', 'public', 'images', userId);
    fs.mkdirSync(imageDir, { recursive: true });
    req.file.filename = Date.now() + req.file.originalname;  
    try {
      await sharp(req.file.buffer).jpeg({ quality: 20 }).toFile(`${imageDir}/${req.file.filename}`);
    } catch (error) {
      console.error('Erreur lors du redimensionnement de l\'image :', error);
      next();
      return;
    }
    next();
  };
  
  