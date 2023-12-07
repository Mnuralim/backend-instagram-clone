"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../middleware/authentication"));
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
router.post("/register", auth_1.register);
router.post("/login", auth_1.loginWithCredential);
router.post("/login-google", auth_1.loginWithGoogle);
router.get("/me", authentication_1.default, auth_1.checkMe);
router.delete("/logout", auth_1.logOut);
const AuthRouter = router;
exports.default = AuthRouter;
