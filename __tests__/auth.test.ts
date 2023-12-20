/* eslint-disable @typescript-eslint/no-non-null-assertion */
import supertest = require('supertest')
import app from '../src/app'
import mongoose from 'mongoose'

describe('API auth', () => {
  let accessToken = ''
  let emailForLogin = ''
  let passwordForLogin = ''
  let usernameForLogin = ''
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
    describe('Success registration', () => {
      it('should return a 201 status code and success was true', async () => {
        const payload = {
          username: 'test' + Math.floor(Math.random() * 9000),
          password: '123456',
          email: `test${Math.floor(1000 + Math.random() * 9000)}@gmail.com`
        }

        const { statusCode, body } = await supertest(app)
          .post('/api/v1/auths/register')
          .send(payload)

        emailForLogin = payload.email
        passwordForLogin = payload.password
        usernameForLogin = payload.username

        expect(statusCode).toBe(201)
        expect(body.success).toBe(true)
      })
    })
    describe('failed registration, email already reistered', () => {
      it('should return a 400 status code', async () => {
        const payload = {
          username: `test${Math.floor(Math.random() * 9000)}`,
          password: '123456',
          email: emailForLogin
        }

        const { statusCode } = await supertest(app)
          .post('/api/v1/auths/register')
          .send(payload)

        expect(statusCode).toBe(400)
      })
    })
    describe('failed registration, username already registered', () => {
      it('should return a 400 status code and message : "username already exist"', async () => {
        const payload = {
          username: usernameForLogin,
          password: '123456',
          email: `test${Math.floor(Math.random() * 9000)}@gmail.com`
        }

        const { statusCode, body } = await supertest(app)
          .post('/api/v1/auths/register')
          .send(payload)

        expect(statusCode).toBe(400)
        expect(body.message).toBe('Username already exist')
      })
    })

    describe('failed registration, Internal server errror', () => {
      it('should return a 500 status code and message : "Internal Server Error"', async () => {
        jest.spyOn(mongoose.model('User'), 'findOne').mockImplementationOnce(() => {
          throw new Error('Internal Server Error')
        })

        const payload = {
          username: 'shadownur345',
          password: '123456',
          email: 'shadownur345x@gmail.com'
        }

        const { statusCode, body } = await supertest(app)
          .post('/api/v1/auths/register')
          .send(payload)

        expect(statusCode).toBe(500)
        expect(body.message).toBe('Internal Server Error')
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
          password: passwordForLogin + 123,
          email: emailForLogin
        }

        const { statusCode, body } = await supertest(app)
          .post('/api/v1/auths/login')
          .send(payload)

        expect(statusCode).toBe(400)
        expect(body.message).toBe('Wrong password')
      })
    })

    describe('failed login, Internal Server Error', () => {
      it('should return a 500 status code and message : "Internal Server Error', async () => {
        jest.spyOn(mongoose.model('User'), 'findOne').mockImplementationOnce(() => {
          throw new Error('Internal Server Error')
        })
        const payload = {
          password: passwordForLogin,
          email: emailForLogin
        }

        const { statusCode, body } = await supertest(app)
          .post('/api/v1/auths/login')
          .send(payload)

        expect(statusCode).toBe(500)
        expect(body.message).toBe('Internal Server Error')
      })
    })

    describe('Success login', () => {
      it('should return a 200 status code', async () => {
        const payload = {
          password: passwordForLogin,
          email: emailForLogin
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
      it('should return a 200 status code, and user not registered before', async () => {
        const payload = {
          imageProfile: 'test.com',
          email: `test${Math.floor(1000 + Math.random() * 9000)}@gmail.com`,
          fullName: `test fullname ${Math.floor(1000 + Math.random() * 9000)}`
        }

        const { statusCode, body } = await supertest(app)
          .post('/api/v1/auths/login-google')
          .send(payload)

        expect(statusCode).toBe(200)
        expect(body.message).toBe('Login successfully')
      })
    })

    describe('success login', () => {
      it('should return a 200 status code, and user already registered before', async () => {
        const payload = {
          email: emailForLogin
        }

        const { statusCode, body } = await supertest(app)
          .post('/api/v1/auths/login-google')
          .send(payload)

        expect(statusCode).toBe(200)
        expect(body.message).toBe('Login successfully')
      })
    })

    describe('Failed login', () => {
      it('should return a 500 status code and return message Internal Server Error', async () => {
        jest.spyOn(mongoose.model('User'), 'findOne').mockImplementationOnce(() => {
          throw new Error('Internal Server Error')
        })
        const payload = {
          imageProfile: 'test.com',
          email: 'agus@gmail.com',
          fullName: 'agus cahyo'
        }

        const { statusCode, body } = await supertest(app)
          .post('/api/v1/auths/login-google')
          .send(payload)

        expect(statusCode).toBe(500)
        expect(body.message).toBe('Internal Server Error')
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
    describe('Success logout', () => {
      it('should log out a user', async () => {
        const testUser = await mongoose.model('User').create({
          refreshToken: 'validRefreshToken' + Math.floor(Math.random() * 9000),
          username: 'test' + Math.floor(Math.random() * 9000),
          email: `test${Math.floor(1000 + Math.random() * 9000)}@gmail.com`
        })
        const response = await supertest(app)
          .delete('/api/v1/auths/logout')
          .set('Cookie', [`refreshToken=${testUser.refreshToken}`])
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe('Logout successfully')
      })
    })

    describe('Failed logout', () => {
      it('should return message Internal Server Error and return a 500 status code', async () => {
        jest.spyOn(mongoose.model('User'), 'findOne').mockImplementationOnce(() => {
          throw new Error('Internal Server Error')
        })
        const testUser = await mongoose.model('User').create({
          refreshToken: 'validRefreshToken' + Math.floor(Math.random() * 9000),
          username: 'test' + Math.floor(Math.random() * 9000),
          email: `test${Math.floor(1000 + Math.random() * 9000)}@gmail.com`,
          emails: `test${Math.floor(1000 + Math.random() * 9000)}@gmail.com`
        })
        const { statusCode, body } = await supertest(app)
          .delete('/api/v1/auths/logout')
          .set('Cookie', [`refreshToken=${testUser.refreshToken}`])
        expect(statusCode).toBe(500)
        expect(body.message).toBe('Internal Server Error')
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
    describe('Failed check me', () => {
      it('should return a 500 status code', async () => {
        jest.spyOn(mongoose.model('User'), 'findById').mockImplementationOnce(() => {
          throw new Error('Internal Server Error')
        })
        const { statusCode, body } = await supertest(app)
          .get('/api/v1/auths/me')
          .set('Authorization', `Bearer ${accessToken}`)

        expect(statusCode).toBe(500)
        expect(body.message).toBe('Internal Server Error')
      })
    })
  })
})
