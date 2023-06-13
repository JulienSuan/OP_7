const express = require("express")
const bookController = require("../controllers/bookController")
const auth = require("../controllers/authController")
const {upload} = require("../middlewares/multer")
const {resize} = require("../middlewares/multer")
const router = express.Router()



router.get("/api/books/bestrating", bookController.bestratingBooks)
router.get("/api/books",  bookController.books)
router.get("/api/books/:id",  bookController.bookId)
router.post("/api/books/:id/rating", auth.auth, bookController.noteBook)
router.post("/api/books", auth.auth,  upload.single('image'), resize, bookController.addBook)
router.put("/api/books/:id",auth.auth,  upload.single('image'),resize,   bookController.updateBook)
router.delete("/api/books/:id",auth.auth, bookController.deleteBook)




module.exports = router