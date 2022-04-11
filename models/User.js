const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    default: "",
  },
  image: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/7/72/Default-welcomer.png",
  },
});

userSchema.pre("save", async function (next) {
  console.log(this);
  if (this.modifiedPaths().includes("password")) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const valuesToUpdate = this.getUpdate();
  console.log("test i modellen");
  console.log(`values att updatera: ${valuesToUpdate}`);
  console.log(this._update.password);
  const hash = await bcrypt.hash(this._update.password, 10);
  this._update.password = hash;
  console.log(hash);
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

const User = mongoose.model("User", userSchema);

exports.User = User;
