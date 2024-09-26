var mongoose = require('mongoose');
var connectToDatabase = require('./db');
var User = require('./User');
var bcrypt = require('bcryptjs');

async function createUsers() {
  await connectToDatabase();

  var users = [
    {
      name: 'مدير النظام',
      email: 'admin@admin.com',
      password: bcrypt.hashSync('admin1234', 10),
      role: 'manager'
    },
    {
      name: 'مستقبل النظام',
      email: 'user@user.com',
      password: bcrypt.hashSync('user1234', 10),
      role: 'receptionist'
    }
  ];

  for (var i = 0; i < users.length; i++) {
    var userData = users[i];
    var existingUser = await User.findOne({ email: userData.email });
    
    if (!existingUser) {
      var user = new User(userData);
      await user.save();
      console.log('المستخدم ' + user.name + ' تم إنشاؤه بنجاح');
    } else {
      console.log('المستخدم ' + existingUser.name + ' موجود بالفعل');
    }
  }

  mongoose.connection.close();
}

createUsers();
