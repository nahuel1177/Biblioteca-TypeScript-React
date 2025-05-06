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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var connection_1 = require("./db/connection");
var cors_1 = __importDefault(require("cors"));
var userRoute_1 = require("./routes/userRoute");
var bookRoute_1 = require("./routes/bookRoute");
var loanRoute_1 = require("./routes/loanRoute");
var memberRoute_1 = require("./routes/memberRoute");
var authRoute_1 = require("./routes/authRoute");
var middlewares_1 = require("./middlewares");
var constants_1 = require("./common/constants");
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Ruta de autenticación (login) - sin protección
app.use("/api", authRoute_1.authRouter);
// Crear un router para las rutas protegidas
var protectedRoutes = express_1.default.Router();
// Aplicar middlewares de autenticación y autorización a todas las rutas protegidas
protectedRoutes.use(middlewares_1.authentication);
protectedRoutes.use((0, middlewares_1.authorization)(['admin', 'employee']));
// Registrar las rutas protegidas
protectedRoutes.use("/users", userRoute_1.userRouter);
protectedRoutes.use("/books", bookRoute_1.bookRouter);
protectedRoutes.use("/loans", loanRoute_1.loanRouter);
protectedRoutes.use("/members", memberRoute_1.memberRouter);
// Montar las rutas protegidas bajo /api
app.use("/api", protectedRoutes);
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var port_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, connection_1.connectDB)()];
                case 1:
                    _a.sent();
                    port_1 = constants_1.PORT || 3000;
                    app.listen(port_1, function () {
                        console.log("Server is running on port ".concat(port_1));
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error initializing the application:", error_1);
                    process.exit(1); // Terminate the application on error
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
start();
