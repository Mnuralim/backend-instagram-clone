"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../middleware/authentication"));
const user_1 = require("../controllers/user");
const uploadFile_1 = __importDefault(require("../middleware/uploadFile"));
const validation_1 = __importDefault(require("../middleware/validation"));
const router = express_1.default.Router();
router.get('/', authentication_1.default, user_1.getAllUsers);
router.patch('/', authentication_1.default, uploadFile_1.default.single('image'), user_1.updateUser);
router.get('/email/:email', user_1.getUserByEmail);
router.get('/:id', authentication_1.default, (0, validation_1.default)('user'), user_1.getUserById);
router.patch('/follow/:id', authentication_1.default, (0, validation_1.default)('user'), user_1.followUser);
const UserRouter = router;
exports.default = UserRouter;
