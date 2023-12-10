/* eslint-disable @typescript-eslint/no-non-null-assertion */
import supertest = require('supertest')
import app from '../src/app'
import mongoose from 'mongoose'

describe('API auth', () => {
  let accessToken = ''
  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL_TESTING!)
    } catch (error) {
      console.log(error)
    }
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })
  describe('registraion route', () => {
    describe('failed registration, email already reistered', () => {
      it('should return a 400 status code', async () => {
        const payload = {
          username: 'shadownur345',
          password: '123456',
          email: 'shadownur345@gmail.com'
        }

        const { statusCode } = await supertest(app)
          .post('/api/v1/auths/register')
          .send(payload)

        expect(statusCode).toBe(400)
      })
    })
    describe('failed registration, username already reistered', () => {
      it('should return a 400 status code', async () => {
        const payload = {
          username: 'shadownur345',
          password: '123456',
          email: 'shadownur345@gmail.com'
        }

        const { statusCode } = await supertest(app)
          .post('/api/v1/auths/register')
          .send(payload)

        expect(statusCode).toBe(400)
      })
    })
    describe('Success registration', () => {
      it('should return a 200 status code and success was true', async () => {
        const payload = {
          username: 'axis' + Math.floor(Math.random() * 9000),
          password: '123456',
          email: `axis${Math.floor(1000 + Math.random() * 9000)}@gmail.com`
        }

        const { statusCode, body } = await supertest(app)
          .post('/api/v1/auths/register')
          .send(payload)
        expect(statusCode).toBe(201)
        expect(body.success).toBe(true)
      })
    })
  })

  describe('login with credential route', () => {
    describe('failed login, user not found', () => {
      it('should return a 404 status code', async () => {
        const payload = {
          password: '123456',
          email: 'aguss@gmail.com'
        }

        const { statusCode, body } = await supertest(app)
          .post('/api/v1/auths/login')
          .send(payload)

        expect(statusCode).toBe(404)
        expect(body.message).toBe('User not found')
      })
    })
    describe('failed login, wrong password', () => {
      it('should return a 400 status code', async () => {
        const payload = {
          password: '123456789',
          email: 'shadownur345@gmail.com'
        }

        const { statusCode, body } = await supertest(app)
          .post('/api/v1/auths/login')
          .send(payload)

        expect(statusCode).toBe(400)
        expect(body.message).toBe('Wrong password')
      })
    })
    describe('Success login', () => {
      it('should return a 200 status code', async () => {
        const payload = {
          password: '123456',
          email: 'axis0.6233489586558105@gmail.com'
        }

        const { statusCode, body } = await supertest(app)
          .post('/api/v1/auths/login')
          .send(payload)

        accessToken = body.data.accessToken

        expect(statusCode).toBe(200)
        expect(body.message).toBe('Login successfully')
      })
    })
  })

  describe('login with google route', () => {
    describe('success login', () => {
      it('should return a 200 status code', async () => {
        const payload = {
          imageProfile: 'test.com',
          email: 'agus@gmail.com',
          fullName: 'agus cahyo'
        }

        const { statusCode, body } = await supertest(app)
          .post('/api/v1/auths/login-google')
          .send(payload)

        expect(statusCode).toBe(200)
        expect(body.message).toBe('Login successfully')
      })
    })
  })

  describe('logout route', () => {
    describe('Failed logout', () => {
      it('should handle the case when refreshToken is not provided and return a 204 status code', async () => {
        const { statusCode } = await supertest(app)
          .delete('/api/v1/auths/logout')
          .set('Cookie', [
            'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc0NzA5ZTQ1OTFmZGZlMWVhOGU1OGIiLCJ1c2VybmFtZSI6InNoYWRvd251cjM0NSIsImVtYWlsIjoic2hhZG93bnVyMzQ1QGdtYWlsLmNvbSIsImlhdCI6MTcwMjEzMTY2NSwiZXhwIjoxNzAyMjE4MDY1fQ.4BRcxpqqy-q7V46HvvZceCCZ-07OF2WzOscmFTj4UuY'
          ])
        expect(statusCode).toBe(204)
      })
    })
  })

  describe('check me route', () => {
    describe('Failed check me', () => {
      it('should return a 401 status code', async () => {
        const { statusCode, body } = await supertest(app).get(
          '/api/v1/auths/me'
        )

        expect(statusCode).toBe(401)
        expect(body.message).toBe('No token')
      })
    })

    describe('Success check me', () => {
      it('should return a 200 status code', async () => {
        const { statusCode, body } = await supertest(app)
          .get('/api/v1/auths/me')
          .set('Authorization', `Bearer ${accessToken}`)

        expect(statusCode).toBe(200)
        expect(body.success).toBe(true)
      })
    })
  })
})
