// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const User = require('./Database/User'); 

// mongoose.connect('mongodb+srv://User:password0123@finalproject.0i4uh.mongodb.net/coursedb?retryWrites=true&w=majority&appName=FinalProject', { useNewUrlParser: true, useUnifiedTopology: true });


// async function hashExistingPasswords() {
//   const users = await User.find({});
//   console.log('Users found:', users.length);

//   for (const user of users) {
//     if (user.password && !user.password.startsWith('$2b$')) { // Check if password is defined and not already hashed
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(user.password, salt);
//       user.password = hashedPassword;
//       await user.save();
//       console.log(`Password for user ${user.username} hashed and updated in the database.`);
//     } else {
//       console.log(`Password for user ${user.username} is already hashed or undefined.`);
//     }
//   }

//   mongoose.disconnect();
// }

// hashExistingPasswords().catch(err => console.error(err));