const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

const bcrypt = require('bcrypt');
const User = require('../models/user');

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('secret', 10);

    const user = new User({
      username: 'root',
      passwordHash,
    });

    await user.save();
  });

  test('See if one user is in DB after initilization', async () => {
    const allData = await User.find({});
    expect(allData).toHaveLength(1);
  });

  test('creation succeeds with a fresh username', async () => {
    let usersInDb = async () => {
      const users = await User.find({});
      return users.map((u) => u.toJSON());
    };
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });
  test('creation fails with proper statuscode and message if username already taken', async () => {
    let usersInDb = async () => {
      const users = await User.find({});
      return users.map((u) => u.toJSON());
    };
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('root');

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});
