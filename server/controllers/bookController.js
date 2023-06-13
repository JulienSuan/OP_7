const Book = require("../models/Book")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const mongoose = require("mongoose")
const {unlink} = require("fs/promises")
const fs = require("fs")
const path = require('path');


exports.books = catchAsync(async (req, res, next) => {
  const books = await Book.find();  
    if (!books[0]) {
        return next(new AppError("Il y a aucun livre d'enregistré !", 404))
    }
    res.status(200).send(books)
})

exports.bookId = catchAsync(async (req, res, next) => {
  const id = req.params.id
    const book = await Book.find({_id : new mongoose.Types.ObjectId(id.trim())});  
    if (book) {    
      res.status(200).send(book[0])
    }

})

exports.deleteBook = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const book = await Book.findOne({ _id: new mongoose.Types.ObjectId(id.trim()) });
  const userId = book.userId
  if (book) {
    let filename = book.imageUrl.split("/images/")[1];
    let imagePath = path.join('public/images', filename);

    await fs.promises.unlink(imagePath);
    await Book.deleteOne({ _id: book._id });
    
    const userFolderPath = path.join(__dirname, "..", 'public/images', userId);
    console.log("boo")
    const userFiles = await fs.promises.readdir(userFolderPath);
    if (userFiles.length === 0) {
      await fs.promises.rmdir(userFolderPath);
    }
    res.status(200).send(book);
  }
});



exports.updateBook = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (req.file) {
    const userId = JSON.parse(req.body.book).userId;
    const book = await Book.findOne(new mongoose.Types.ObjectId(id.trim()))
    if (book) {
    
      const bookurl = book.imageUrl
      let filename = bookurl.split("/images/")[1];
      let imagePath = path.join('public/images', filename);
      await unlink(imagePath);
      const databook = JSON.parse(req.body.book)
      const newBook = { ...databook, imageUrl: `${req.protocol}://${req.get('host')}/public/images/${userId}/${req.file.filename}` }
      const updatedBook = await Book.updateOne({ _id: id }, newBook)
      if (updatedBook) {    
        res.status(201).send(updatedBook);
      }  
    }
  } else {
    const updatedBook = await Book.updateOne({ _id: id }, req.body)
    if (updatedBook) {
      res.status(201).send(req.body);
    }
  }
});


exports.bestratingBooks = catchAsync(async (req, res, next) => {
  const top = await Book.find().limit(3).sort({ratings: -1})
  res.status(200).json(top)
});


exports.addBook = catchAsync(async (req, res, next) => {
  
  if (req.file) {
    const book = JSON.parse(req.body.book);
    
    
    const imagePath = `${req.protocol}://${req.get('host')}/public/images/${book.userId}`;
    const imageDir = path.join(__dirname, '..', 'public', 'images', book.userId);
    
  
    fs.mkdirSync(imageDir, { recursive: true });


      const newBook = { ...book, imageUrl: `${imagePath}/${req.file.filename}` };
      console.log(newBook)
      const savedBook = await Book.create(newBook);

      res.status(200).json({
        message: "Livre ajouté avec succès",
        data: savedBook,
      });
    } else {
      return next(new AppError("vous n'avez pas ajouté une image", 404))
    }
});




exports.noteBook = catchAsync(async (req, res, next) => {
  const bookId = req.params.id;
  const { userId, rating } = req.body;

  const book = await Book.findById(bookId);

  if (!book) {
    return next(new AppError('Livre non trouvé', 404));
  }

  book.ratings.push({ userId, grade: rating });

  const ratingsCount = book.ratings.length;
  const ratingsSum = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
  book.averageRating = ratingsSum / ratingsCount;

  await book.save();

  console.log(book);

  res.json({
    message: 'Note ajoutée avec succès',
    data: book,
  });
});
