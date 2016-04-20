// var mongoose     = require('mongoose')
//   , Schema       = mongoose.Schema
//   , bcrypt   = require('bcrypt-nodejs')
//   , SALT_WORK_FACTOR = 10;

// // user schema 
// var UserSchema = new Schema({
//   name: String,
//   last_name: String,
//   gender: Number, //none-2, boy-1, girl-0
//   email: String,
//   total_quotes: Number,
//   username: { type: String, required: true, index: { unique: true }}, //this is not needed in the real app, this is still here so that it doesn't break the code.
//   password: { type: String, required: true },
// });


// // hash the password before the user is saved
// UserSchema.pre('save', function(next)  {
//   var user = this

//   // only hash the password if it has been modified (or is new)
//   if (!user.isModified('password'))
//     return next()
  
//   // generate a salt
//   bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//     if (err) return next(err)

//     // hash the password along with our new salt
//     bcrypt.hash(user.password, salt, null ,function(err, hash) {
//       if (err) return next(err)

//       // override the cleartext password with the hashed one
//       user.password = hash
//       next()
//     })
//   })

// })

// // method to compare a given password with the database hash
// UserSchema.methods.comparePassword = function(candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   })
// }




// module.exports = mongoose.model('User', UserSchema);
