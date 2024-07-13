// functions/login.js

const fs = require('fs');
const bcrypt = require('bcryptjs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { email, password } = JSON.parse(event.body);

  try {
    // Read user data from file (for demo purposes)
    const users = fs.readFileSync('./users.txt', 'utf8').split('\n');
    
    for (let user of users) {
      const [storedEmail, hashedPassword] = user.split(':');
      if (email === storedEmail && bcrypt.compareSync(password, hashedPassword)) {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Login successful' }),
        };
      }
    }

    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid email or password' }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
