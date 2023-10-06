const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;


//MIDDLEWARE 

//REGISTER

exports.register = async (req, res) => {
  console.log(req.body);
  const { username, password, email } = req.body;
  try {
    const existingUser = await User.findOne({username});
    if(existingUser) {
      res.status(400).json({msg: "User already exist"});
    }

    // const imageUrl = await cloudinary.uploader.upload(req.body.file, {
    //   folder: 'profilePictures', // Replace with the desired folder name in your Cloudinary account
    // });


    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newuser = new User({
      username,
      password: hashedPassword,
      email,
      // profilePicture: imageUrl.secure_url,
    });

    const savedUser = await newuser.save();

    const token = jwt.sign(
      { id: newuser._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '24h' }
    )
    res.status(201).json({ savedUser, token });

  } catch (err) {
    res.status(500).json(err)
  }
}

// LOGIN

exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({
        errors: [
          {
            param: 'username',
            msg: 'Invalid username or password'
          }
        ]
      })
    }
    
    console.log(user.password);
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);

    if (!isMatch) {
      return res.status(401).json({
        errors: [
          {
            param: 'username',
            msg: 'Invalid username or password'
          }
        ]
      })
    }

    user.password = undefined

    const token = jwt.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '24h' }
    )

    res.status(200).json({ user, token })

  } catch (err) {
    res.status(500).json({err})
  }
}