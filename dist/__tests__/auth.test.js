"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const supertest = require("supertest");
const app_1 = __importDefault(require("../src/app"));
const mongoose_1 = __importDefault(require("mongoose"));
describe('API auth', () => {
    let accessToken = '';
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(process.env.MONGO_URL_TESTING);
        }
        catch (error) {
            console.log(error);
        }
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        yield mongoose_1.default.connection.close();
    }));
    describe('registraion route', () => {
        describe('failed registration, email already reistered', () => {
            it('should return a 400 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const payload = {
                    username: 'shadownur345',
                    password: '123456',
                    email: 'shadownur345@gmail.com'
                };
                const { statusCode } = yield supertest(app_1.default)
                    .post('/api/v1/auths/register')
                    .send(payload);
                expect(statusCode).toBe(400);
            }));
        });
        describe('failed registration, username already reistered', () => {
            it('should return a 400 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const payload = {
                    username: 'shadownur345',
                    password: '123456',
                    email: 'shadownur345@gmail.com'
                };
                const { statusCode } = yield supertest(app_1.default)
                    .post('/api/v1/auths/register')
                    .send(payload);
                expect(statusCode).toBe(400);
            }));
        });
        describe('Success registration', () => {
            it('should return a 200 status code and success was true', () => __awaiter(void 0, void 0, void 0, function* () {
                const payload = {
                    username: 'axis' + Math.floor(Math.random() * 9000),
                    password: '123456',
                    email: `axis${Math.floor(1000 + Math.random() * 9000)}@gmail.com`
                };
                const { statusCode, body } = yield supertest(app_1.default)
                    .post('/api/v1/auths/register')
                    .send(payload);
                expect(statusCode).toBe(201);
                expect(body.success).toBe(true);
            }));
        });
    });
    describe('login with credential route', () => {
        describe('failed login, user not found', () => {
            it('should return a 404 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const payload = {
                    password: '123456',
                    email: 'aguss@gmail.com'
                };
                const { statusCode, body } = yield supertest(app_1.default)
                    .post('/api/v1/auths/login')
                    .send(payload);
                expect(statusCode).toBe(404);
                expect(body.message).toBe('User not found');
            }));
        });
        describe('failed login, wrong password', () => {
            it('should return a 400 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const payload = {
                    password: '123456789',
                    email: 'shadownur345@gmail.com'
                };
                const { statusCode, body } = yield supertest(app_1.default)
                    .post('/api/v1/auths/login')
                    .send(payload);
                expect(statusCode).toBe(400);
                expect(body.message).toBe('Wrong password');
            }));
        });
        describe('Success login', () => {
            it('should return a 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const payload = {
                    password: '123456',
                    email: 'axis0.6233489586558105@gmail.com'
                };
                const { statusCode, body } = yield supertest(app_1.default)
                    .post('/api/v1/auths/login')
                    .send(payload);
                accessToken = body.data.accessToken;
                expect(statusCode).toBe(200);
                expect(body.message).toBe('Login successfully');
            }));
        });
    });
    describe('login with google route', () => {
        describe('success login', () => {
            it('should return a 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const payload = {
                    imageProfile: 'test.com',
                    email: 'agus@gmail.com',
                    fullName: 'agus cahyo'
                };
                const { statusCode, body } = yield supertest(app_1.default)
                    .post('/api/v1/auths/login-google')
                    .send(payload);
                expect(statusCode).toBe(200);
                expect(body.message).toBe('Login successfully');
            }));
        });
    });
    describe('logout route', () => {
        describe('Failed logout', () => {
            it('should handle the case when refreshToken is not provided and return a 204 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode } = yield supertest(app_1.default)
                    .delete('/api/v1/auths/logout')
                    .set('Cookie', [
                    'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc0NzA5ZTQ1OTFmZGZlMWVhOGU1OGIiLCJ1c2VybmFtZSI6InNoYWRvd251cjM0NSIsImVtYWlsIjoic2hhZG93bnVyMzQ1QGdtYWlsLmNvbSIsImlhdCI6MTcwMjEzMTY2NSwiZXhwIjoxNzAyMjE4MDY1fQ.4BRcxpqqy-q7V46HvvZceCCZ-07OF2WzOscmFTj4UuY'
                ]);
                expect(statusCode).toBe(204);
            }));
        });
    });
    describe('check me route', () => {
        describe('Failed check me', () => {
            it('should return a 401 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode, body } = yield supertest(app_1.default).get('/api/v1/auths/me');
                expect(statusCode).toBe(401);
                expect(body.message).toBe('No token');
            }));
        });
        describe('Success check me', () => {
            it('should return a 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode, body } = yield supertest(app_1.default)
                    .get('/api/v1/auths/me')
                    .set('Authorization', `Bearer ${accessToken}`);
                expect(statusCode).toBe(200);
                expect(body.success).toBe(true);
            }));
        });
    });
});
