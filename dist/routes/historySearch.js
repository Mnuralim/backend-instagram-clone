"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../middleware/authentication"));
const historySearch_1 = require("../controllers/historySearch");
const validation_1 = __importDefault(require("../middleware/validation"));
const router = express_1.default.Router();
router.post("/:targetUser", authentication_1.default, historySearch_1.addHistory);
router.get("/", authentication_1.default, historySearch_1.getAllHistory);
router.delete("/", authentication_1.default, historySearch_1.deleteAllHistory);
router.delete("/:id", authentication_1.default, (0, validation_1.default)("history"), historySearch_1.deleteHistory);
const HistoryRouter = router;
exports.default = HistoryRouter;
