const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true);
})
 
const userOne = { username: 'Jane', password: 'password1' };
const userTwo = { username: 'John', password: 'password2' };
const userThree = { username: 'Tyler', password: 'password3' };
const userFour = { username: 'Zara', password: 'password4' };
const userFive = { username: 'Zainu', password: 'password5' };


beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})

afterAll(async () => {
  await db.destroy();
})


describe('server.js', () => {
  /* 
    Testing POST request to register a new User
    Testing POST request for a registered User to login   
    Testing GET request for an authenticated User with a JWT token to Access jokes endpoint
  */
  describe('Endpoints for Authentication', () => {
    // Testing the endpoint to Register Users
    describe('POST Request for /api/auth/register', () => {
      beforeEach(async () => {
        await db('users').truncate()
      })
      // Testing the creation of a user
      it('Creates a new user with a bcrypted password and adds them to the User\'s table on success', async () => {
        await request(server).post('/api/auth/register').send(userOne)
        const newUser = await db('users').first()
        expect(newUser).toHaveProperty('username')
        expect(newUser).toHaveProperty('password')
        expect(newUser).toHaveProperty('id')
        expect(newUser.username).toBe(userOne.username)
        expect(newUser.password).toMatch(/^\$2[ayb]\$.{56}$/)
      })
      // Testing Req.body 
      it('Response comes with a a newly created User with with a bcrypted password on success', async () => {
        const { body } = await request(server).post('/api/auth/register').send(userTwo)
        expect(body).toHaveProperty('username')
        expect(body).toHaveProperty('password')
        expect(body).toHaveProperty('id')
        expect(body.username).toBe(userTwo.username)
        expect(body.password).toMatch(/^\$2[ayb]\$.{56}$/)
      })
    })
    // Testing the endpoint to Login Users
    describe('POST Request for /api/auth/login', () => {
      beforeEach(async () => {
        await db('users').truncate()
        await request(server).post('/api/auth/register').send(userThree)
      })
      // Testing the HTTP Status code on a login attempt with invalid credentials
      it('Responds with a 401 status code error when client provides no credentials or invalid credentials.', async () => {
        const response = await request(server).post('/api/auth/login').send(userFour);
        expect(response.status).toBe(401);
      })
      // Testing the HTTP Status code on a successful Login  
      it('Responds with the proper status code 200 upon successful login', async () => {
        const response = await request(server).post('/api/auth/login').send(userThree);
        expect(response.status).toBe(200);
      })
    })
  })
})

// Testing the endpoint for authenticated Users to access jokes 
describe('Jokes endpoint', () => {
  describe('GET Request for /api/jokes', () => {
    beforeEach(async () => {
      await db('users').truncate()
      await request(server).post('/api/auth/register').send(userFive)
    })
    // Testing error status code given upon missing token
    it('responds with an error status code on missing token', async () => {
      const response = await request(server).get('/api/jokes')
      expect(response.status + '').toMatch(/4|5/)
    })
    // Testing "token required" message given upon missing token
    it('"token required" message given on missing token', async () => {
      const response = await request(server).get('/api/jokes')
      expect(response.text + '').toMatch(/token required/);
    })
  })
})