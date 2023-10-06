const router = require('express').Router()
const userController = require('../controllers/user')
const { body } = require('express-validator')
const validation = require('../handlers/validation')
const tokenHandler = require('../handlers/tokenHandler')
const User = require('../models/user')

// const multer = require('multer');
// const cloudinary = require('cloudinary').v2;
// const { cloudinaryConfig } = require('../config/cloudinary')

// const upload = multer({ storage: multer.memoryStorage() });

// router.use(cloudinaryConfig);

router.post(
  '/signup',
  validation.validate,
  // upload.single('profilePicture'),
  // cloudinaryConfig,
  userController.register
);

router.post(
  '/login',
  body('username').isLength({ min: 4 }).withMessage(
    'username must be at least 8 characters'
  ),
  body('password').isLength({ min: 5 }).withMessage(
    'password must be at least 8 characters'
  ),
  validation.validate,
  userController.login
);

router.post(
  '/verify-token',
  tokenHandler.verifyToken,
  (req, res) => {
    // console.log("post" + req.user);
    res.status(200).json({ user: req.user })
  }
);

module.exports = router;