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
const fetch_1 = require("@/utils/fetch");
const next_auth_1 = __importDefault(require("next-auth"));
const credentials_1 = __importDefault(require("next-auth/providers/credentials"));
const google_1 = __importDefault(require("next-auth/providers/google"));
const nextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        (0, credentials_1.default)({
            type: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Email",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Password",
                },
            },
            authorize(credentials, req) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { email, password } = credentials;
                    const response = yield (0, fetch_1.loginCredentials)({
                        credential: {
                            email,
                            password,
                        },
                    });
                    if (response === null || response === void 0 ? void 0 : response.ok) {
                        const data = yield response.json();
                        return data.data;
                    }
                    else {
                        const data = yield (response === null || response === void 0 ? void 0 : response.json());
                        throw new Error(data.message);
                    }
                });
            },
        }),
        (0, google_1.default)({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        jwt({ token, user, account }) {
            return __awaiter(this, void 0, void 0, function* () {
                if ((account === null || account === void 0 ? void 0 : account.type) === "oauth") {
                    const response = yield (0, fetch_1.loginOauth)({
                        credential: {
                            email: token.email,
                            image: token.picture,
                            name: token.name,
                        },
                    });
                    const data = yield (response === null || response === void 0 ? void 0 : response.json());
                    const accessToken = data.data.token;
                    token.token = accessToken;
                }
                return Object.assign(Object.assign({}, token), user);
            });
        },
        session({ session, token }) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield (0, fetch_1.getUserByEmail)(session.user.email);
                const data = yield (response === null || response === void 0 ? void 0 : response.json());
                const sessionUser = data.data.user;
                session.user.token = token === null || token === void 0 ? void 0 : token.token;
                session.user.email = sessionUser === null || sessionUser === void 0 ? void 0 : sessionUser.email;
                session.user._id = sessionUser === null || sessionUser === void 0 ? void 0 : sessionUser._id;
                session.user.image = (_a = sessionUser === null || sessionUser === void 0 ? void 0 : sessionUser.profile) === null || _a === void 0 ? void 0 : _a.image;
                session.user.username = sessionUser === null || sessionUser === void 0 ? void 0 : sessionUser.username;
                return session;
            });
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
exports.default = (0, next_auth_1.default)(nextAuthOptions);
