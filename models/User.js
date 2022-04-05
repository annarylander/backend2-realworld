const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: ""
  },
  image: {
    type: String, default: "https://upload.wikimedia.org/wikipedia/commons/7/72/Default-welcomer.png" 
  }
});

userSchema.pre("save", async function (next) {
  if (this.modifiedPaths().includes("password")) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  } else {
    return null;
  }
};

userSchema.pre('findOneAndUpdate', async function(next) {
  const user = await this.updateOne({ password });
  bcrypt.hash(user.password, 10, (err, hash) => {
      this.getUpdate().password = hash;
      next();
  })
//   try {
//     if (this._update.password) {
//         const hashed = await bcrypt.hash(this._update.password, 10)
//         this._update.password = hashed;
//     }
//     next();
// } catch (err) {
//     return next(err);
// }
});

// userSchema.pre("findOneAndUpdate", async function (next) {
//   const valuesToUpdate = this.getUpdate()
//   if (valuesToUpdate.password) {
//     valuesToUpdate.password = await bcrypt.hash(valuesToUpdate.password, 10)
//   }
//   next()
// })


const User = mongoose.model("User", userSchema);

exports.User = User;
