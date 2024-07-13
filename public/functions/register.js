// functions/register.js

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
    // Check if user already exists
    const users = fs.readFileSync('./users.txt', 'utf8').split('\n');
    for (let user of users) {
      const [storedEmail] = user.split(':');
      if (email === storedEmail) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'User already exists' }),
        };
      }
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10); // Adjust salt rounds as needed

    // Save user data to file (for demo purposes)
    const userData = `${email}:${hashedPassword}\n`;
    fs.appendFileSync('./users.txt', userData);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Registration successful' }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
