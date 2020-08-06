const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();

  blogObject = new Blog(initialBlogs[2]);
  await blogObject.save();
});

describe('Validating Data in GET Requests', () => {
  test('Return 3 Blog Posts from GET Request', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(3);
  });
  test('Element has an Id Property', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body.filter((item) => item.id)).toHaveLength(
      response.body.length
    );
  });
});

describe('Validating Data in POST Requests', () => {
  test('When POST is made, DB length increases to 4', async () => {
    const newBlog = {
      title: 'This is the note to be added',
      author: 'Kevin McFake',
      url: 'www.fakeblog.com',
      likes: 7,
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const allBlogPosts = await Blog.find({});
    expect(allBlogPosts.length).toBe(initialBlogs.length + 1);
  });

  test('DB contains author Kevin McFake', async () => {
    const newBlog = {
      title: 'This is the note to be added',
      author: 'Kevin McFake',
      url: 'www.fakeblog.com',
      likes: 7,
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const allBlogPosts = await Blog.find({});
    const authorArr = allBlogPosts.map((post) => post.author);
    expect(authorArr).toContain('Kevin McFake');
  });

  test('Blog submitted with no likes defaults to 0', async () => {
    const newBlog = {
      title: 'This is the note to be added',
      author: 'Kevin McFake',
      url: 'www.fakeblog.com',
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const allBlogPosts = await Blog.find({});
    const addedBlog = allBlogPosts.find(
      (item) => item.author === 'Kevin McFake'
    );
    expect(addedBlog.likes).toBeDefined();
  });

  test('400 Response for Missing Title or URL', async () => {
    const newBlog = {
      author: 'Kevin McFake',
      likes: 14,
    };
    await api.post('/api/blogs').send(newBlog).expect(400);
    const allBlogs = await Blog.find({});
    expect(allBlogs).toHaveLength(initialBlogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
