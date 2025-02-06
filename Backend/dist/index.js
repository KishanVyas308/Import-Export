"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const ws_1 = __importStar(require("ws"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const authControler_1 = require("./controller/authControler");
const middleWare_1 = require("./middleWare");
const authRoute_1 = __importDefault(require("./router/authRoute"));
const existingDataRoute_1 = __importDefault(require("./router/existingDataRoute"));
const manageUser_1 = __importDefault(require("./router/manageUser"));
const dataAnalyticsRoute_1 = __importDefault(require("./router/dataAnalyticsRoute"));
const manageUserShippingBillRoute_1 = __importDefault(require("./router/manageUserShippingBillRoute"));
const manageAddByAdminRoute_1 = __importDefault(require("./router/manageAddByAdminRoute"));
const getDataForUserRoute_1 = __importDefault(require("./router/getDataForUserRoute"));
const documentsListRoute_1 = __importDefault(require("./router/documentList/documentsListRoute"));
const formsRoute_1 = __importDefault(require("./router/forms/formsRoute"));
const tempRoute_1 = __importDefault(require("./router/tempRoute"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
exports.prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.get("/api", authControler_1.myData);
//? temp api
app.use("/api/v1/temp", tempRoute_1.default);
//? auth api
app.use("/api/v1/auth", authRoute_1.default);
app.use(middleWare_1.verifyToken);
//? existing data api
app.use("/api/v1/ex", existingDataRoute_1.default);
//? manage user api
app.use("/api/v1/manageUser", manageUser_1.default);
//? data analytics api
app.use("/api/v1/dataAnalytics", dataAnalyticsRoute_1.default);
//? manage user shipping bill api
app.use("/api/v1/manageUserShippingBill", middleWare_1.isAdmin, manageUserShippingBillRoute_1.default);
//? add user and expoter api
app.use("/api/v1/add", middleWare_1.isAdmin, manageAddByAdminRoute_1.default);
//? routes for documentslist
app.use("/api/v1/documentslist", documentsListRoute_1.default);
//? routed for froms
app.use('/api/v1/forms', formsRoute_1.default);
//? get data for user 
app.use("/api/v1/getdata", getDataForUserRoute_1.default);
// Initialize WebSocket server on the same HTTP server
const wss = new ws_1.WebSocketServer({ server: httpServer, path: "/api/socket" });
// Authenticate WebSocket connections
wss.on("connection", (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const params = new URLSearchParams((_a = req.url) === null || _a === void 0 ? void 0 : _a.split("?")[1]);
    const token = params.get("token");
    if (!token) {
        ws.close(1008, "Missing authentication token");
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            ws.close(1008, "Invalid token");
            return;
        }
        ws.user = decoded;
        try {
            // Update the user status as online in the database
            const updatedUser = yield exports.prisma.user.update({
                where: { id: decoded.id },
                data: { isOnline: true },
            });
            // Broadcast to all clients that the user is online
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === ws_1.default.OPEN) {
                    client.send(JSON.stringify({
                        event: "userConnected",
                        data: {
                            id: updatedUser.id,
                            name: updatedUser.contactPersonName,
                            email: updatedUser.email,
                            isOnline: updatedUser.isOnline,
                        },
                    }));
                }
            });
            // Listen for messages from clients (e.g., status updates)
            ws.on("message", (message) => {
                try {
                    const parsedMessage = JSON.parse(message.toString());
                    if (parsedMessage.event === "updateStatus") {
                        // Broadcast updated status to all clients
                        wss.clients.forEach((client) => {
                            if (client.readyState === ws_1.default.OPEN) {
                                client.send(JSON.stringify({
                                    event: "statusChanged",
                                    data: parsedMessage.data,
                                }));
                            }
                        });
                    }
                }
                catch (error) {
                }
            });
            // Handle socket disconnection
            ws.on("close", () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    // Update user status to offline in the database
                    const updatedUser = yield exports.prisma.user.update({
                        where: { id: decoded.id },
                        data: { isOnline: false },
                    });
                    // Broadcast to all clients that the user is offline
                    wss.clients.forEach((client) => {
                        if (client.readyState === ws_1.default.OPEN) {
                            client.send(JSON.stringify({
                                event: "userDisconnected",
                                data: {
                                    id: updatedUser.id,
                                    isOnline: updatedUser.isOnline,
                                },
                            }));
                        }
                    });
                }
                catch (error) {
                    console.error("Error updating user offline status:", error);
                }
            }));
        }
        catch (error) {
            console.error("Error updating user online status:", error);
        }
    }));
}));
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
