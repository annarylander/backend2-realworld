const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const { User } = require("./models/User");
// const { Article } = require("./models/Article");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("dist"));

const requireLogin = (req, res, next) => {
  const authHeader = req.header("Authorization");

  try {
    const token = authHeader.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    console.log("inloggad");
    console.log(token);
    console.log(req.user);
    next();
  } catch (err) {
    console.log(err);
    res.status(401);
  }
};

const createToken = (user) => {
  const userId = user._id.toString();
    const token = jwt.sign(
      { userId, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "60h",
        subject: userId,
      }
    );
}

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.post("/users", async (req, res) => {
  console.log(req.body);
  

  const { username, email, password } = req.body.user;
  
    const user = await User.create({
      username: username,
      email: email,
      password: password,

      
    });

    // const token = createToken(user)
    // console.log(token)

    const userId = user._id.toString()
    const token = jwt.sign({
      userId, email: user.email},
      process.env.JWT_SECRET,
      {expiresIn: "2 h", subject: userId}
    )
    
    res.json({ user: {
    email: email,
    username: username,
    bio: user.bio,
    image: user.image,
    token: token
    } 
    });
  
});



app.post("/users/login", async (req, res) => {
  const { email, password } = req.body.user;
  console.log(req.body);
  const user = await User.login(email, password);
  if (user) {
    const userId = user._id.toString();
    const token = jwt.sign(
      { userId, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "60h",
        subject: userId,
      }
    );
    res.json({ token });
  } else {
    res.sendStatus(401);
  }
  
});

app.get("/user", requireLogin, async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.json(user);
});

app.put("/user", requireLogin, async (req, res) => {
    console.log(req.body.user)
    console.log(req.user.userId)
    const {email, username, bio, password} = req.body.user
    try{
      await User.updateOne({_id: req.user.userId},
         {$set: {username: username, bio: bio, email: email, password: password}})
      res.status(201).json({username, email})
    }
    catch(err){
      console.log(err)
    }
})


// app.post("/articles", async (req, res) => {
//   const { title, description, body, tagList } = req.body.article;
//   console.log(req.body);
//   try {
//     const article = await Article.create({
//       title: title,
//       description: description,
//       body: body,
//       tagList: tagList,
//     });
//     res.status(201).json({ article });
//   } catch (err) {
//     console.log(err);
//     res.status(400);
//   }
// });

mongoose.connect("mongodb://localhost/realworld");
app.listen(PORT, () => {
  console.log(`Started Express server on port ${PORT}`);
});
