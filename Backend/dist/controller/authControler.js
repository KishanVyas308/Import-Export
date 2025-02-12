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
exports.myData = exports.login = exports.signup = void 0;
const __1 = require("..");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, contactPersonName, companyName, addressLine1, addressLine2, city, state, country, pin, webpage, phoneNumber, gstNo, companyLogo, role, } = req.body;
    try {
        const user = yield __1.prisma.user.create({
            data: {
                email,
                password: yield bcryptjs_1.default.hash(password, 10),
                contactPersonName,
                companyName,
                addressLine1,
                addressLine2,
                city,
                state,
                country,
                pin,
                webpage,
                phoneNumber,
                gstNo,
                companyLogo,
                role
            },
        });
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            name: user.contactPersonName,
        }, process.env.JWT_SECRET);
        return res.status(200).json({
            token,
        });
    }
    catch (error) {
        return res.json({ message: "Please try again later" + error });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield __1.prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                email: true,
                password: true,
                contactPersonName: true,
                role: true,
            },
        });
        if (!user) {
            return res.json({ message: "Please register first" });
        }
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.json({ message: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            name: user.contactPersonName,
            role: user.role,
        }, process.env.JWT_SECRET);
        res.status(200).json({
            token,
        });
    }
    catch (error) {
        console.error("Error authenticating user:", error);
        res.json({ message: "Please try again later after some time" });
    }
});
exports.login = login;
const myData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const htmlResponse = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        text-align: center;
        background: #fff;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #333;
      }
      p {
        color: #555;
        font-size: 1.2em;
      }
      .highlight {
        color: #007bff;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome to Udhog4 API section</h1>
      <p>Created by <a href="https://www.linkedin.com/in/kishanvyas308" class="highlight">Kishan Vyas</a></p>
    </div>
  </body>
  </html>
`;
    return res.send(htmlResponse);
});
exports.myData = myData;
