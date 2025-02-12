import { prisma } from "..";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req: any, res: any) => {
  const {
    email,
    password,
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
    role,
  } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
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

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.contactPersonName,
      },
      process.env.JWT_SECRET as string
    );

    return res.status(200).json({
      token,
    });
  } catch (error) {
    return res.json({ message: "Please try again later" + error});
  }
};

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
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

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.contactPersonName,
        role: user.role,
      },
      process.env.JWT_SECRET as string
    );

    res.status(200).json({
      token,
    });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.json({ message: "Please try again later after some time" });

  }
};


export const myData = async (req: any, res: any) => {
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
}