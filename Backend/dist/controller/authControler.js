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
    <title>Udhog4 API</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Poppins', sans-serif;
        background-color: #121212;
        color: #e0e0e0;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        overflow: hidden;
        position: relative;
      }
      .container {
        text-align: center;
        background: #1e1e1e;
        padding: 3rem;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        max-width: 600px;
        width: 90%;
        position: relative;
        z-index: 10;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .container:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      }
      .container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 6px;
        background: linear-gradient(90deg, #6a11cb, #2575fc);
      }
      h1 {
        color: #ffffff;
        font-size: 2.4rem;
        margin-bottom: 1.5rem;
        font-weight: 700;
        letter-spacing: 0.5px;
      }
      p {
        color: #b0b0b0;
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }
      a {
        color: #2575fc;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.2s ease;
      }
      a:hover {
        color: #6a11cb;
        text-decoration: underline;
      }
      .highlight {
        background: linear-gradient(90deg, #6a11cb, #2575fc);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font-weight: 600;
      }
      .badge {
        display: inline-block;
        background: rgba(37, 117, 252, 0.1);
        color: #2575fc;
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        margin-top: 1rem;
        font-size: 0.9rem;
        border: 1px solid rgba(37, 117, 252, 0.2);
      }
      .bg-shapes {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        opacity: 0.5;
      }
      .shape {
        position: absolute;
        background: linear-gradient(45deg, #6a11cb22, #2575fc22);
        border-radius: 50%;
      }
      .shape:nth-child(1) {
        width: 300px;
        height: 300px;
        top: -150px;
        left: -150px;
      }
      .shape:nth-child(2) {
        width: 200px;
        height: 200px;
        bottom: -100px;
        right: -100px;
      }
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0px); }
      }
      .icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        display: inline-block;
        animation: float 6s ease-in-out infinite;
      }
    </style>
  </head>
  <body>
    <div class="bg-shapes">
      <div class="shape"></div>
      <div class="shape"></div>
    </div>
    <div class="container">
      <div class="icon">🚀</div>
      <h1>Welcome to Udhog4 API</h1>
      <p>Explore our powerful API endpoints for seamless integration with your applications</p>
      <div class="badge">REST API v1.0</div>
      <p style="margin-top: 2rem;">Created by <a href="https://www.linkedin.com/in/kishanvyas308" class="highlight">Kishan Vyas</a></p>
    </div>
  </body>
  </html>
`;
    return res.send(htmlResponse);
});
exports.myData = myData;
