import express from "express";
import { createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import cors from "cors";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { myData } from "./controller/authControler";
import { isAdmin, verifyToken } from "./middleWare";

import authRoute from "./router/authRoute";
import existingDataRoute from "./router/existingDataRoute";
import manageUserRoute from "./router/manageUser";
import dataAnalyticsRoute from "./router/dataAnalyticsRoute";
import manageUserShippingBillRoute from "./router/manageUserShippingBillRoute";
import manageAddByAdminRoute from "./router/manageAddByAdminRoute";
import getDataForUserRoute from "./router/getDataForUserRoute";
import documentsListRoute from "./router/documentList/documentsListRoute"
import formsRoute from "./router/forms/formsRoute"
import reportRoute from "./router/report/reportRoute"
import documentsRoute from "./router/documents/documentsRoute"


const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

export const prisma = new PrismaClient();

// Helper function to get upload directory based on environment
const getUploadDirectory = (): string => {
  if (process.env.NODE_ENV === 'production') {
    // In production, use environment variable or default outside project
    const prodUploadPath = process.env.UPLOAD_DIR || path.join('..', '..', 'uploads');
    return path.resolve(prodUploadPath);
  } else {
    // In development, use uploads folder in the project
    return path.join(__dirname, '../uploads');
  }
};

app.use(express.json());

// Serve static files (uploaded documents) with proper headers and range support
app.use('/api/uploads', (req, res, next) => {
  // Extract token from query params or Authorization header
  const token = req.query.token || req.headers.authorization;
  
  console.log('Token received:', token ? 'Present' : 'Missing');
  console.log('Query token:', req.query.token ? 'Present' : 'Missing');
  console.log('Auth header:', req.headers.authorization ? 'Present' : 'Missing');
  
  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  // Verify token
  jwt.verify(token as string, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
    if (err) {
      console.log('JWT verification error:', err.message);
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    console.log('Token verified successfully');
    // Token is valid, proceed to serve the file
    next();
  });
}, express.static(getUploadDirectory(), {
  // Enable range requests for better streaming
  acceptRanges: true,
  // Set cache headers
  maxAge: '1y',
  // Enable etag for better caching
  etag: true,
  // Enable last modified
  lastModified: true,
  // Set proper headers for different file types
  setHeaders: (res, filePath) => {
    // Set headers to allow document embedding and enable range requests
    res.set({
      'X-Frame-Options': 'SAMEORIGIN',
      'Content-Security-Policy': "frame-ancestors 'self' http://localhost:3000 http://localhost:5173 https://shalashikshak.in https://shala-shikshak.pages.dev",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Range, Authorization, X-Requested-With',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      'Vary': 'Accept-Encoding'
    });

    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
    } else if (filePath.endsWith('.doc')) {
      res.setHeader('Content-Type', 'application/msword');
    } else if (filePath.endsWith('.docx')) {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    } else if (filePath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      res.setHeader('Content-Type', `image/${path.extname(filePath).slice(1)}`);
    }
  }
}));

app.get("/api", myData);


//? auth api
app.use("/api/v1/auth", authRoute);

app.use(verifyToken);

//? existing data api
app.use("/api/v1/ex", existingDataRoute);

//? manage user api
app.use("/api/v1/manageUser", manageUserRoute);

//? data analytics api
app.use("/api/v1/dataAnalytics", dataAnalyticsRoute);

//? manage user shipping bill api
app.use("/api/v1/manageUserShippingBill", isAdmin, manageUserShippingBillRoute);

//? add user and expoter api
app.use("/api/v1/admin", manageAddByAdminRoute);

//? routes for documentslist
app.use("/api/v1/documentslist", documentsListRoute)

//? routed for froms
app.use('/api/v1/forms', formsRoute)

//? routes for reports
app.use('/api/v1/reports', reportRoute)

//? routes for documents
app.use('/api/v1/documents', documentsRoute)

//? get data for user 
app.use("/api/v1/getdata", getDataForUserRoute);


// Initialize WebSocket server on the same HTTP server
const wss = new WebSocketServer({ server: httpServer, path: "/api/socket" });

// Authenticate WebSocket connections
wss.on("connection", async (ws: any, req: any) => {
  const params = new URLSearchParams(req.url?.split("?")[1]);
  const token = params.get("token");

  if (!token) {
    ws.close(1008, "Missing authentication token");
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    async (err: any, decoded: any) => {
      if (err) {
        ws.close(1008, "Invalid token");
        return;
      }

      ws.user = decoded;

      try {
        // Update the user status as online in the database
        const updatedUser = await prisma.user.update({
          where: { id: decoded.id },
          data: { isOnline: true },
        });

        // Broadcast to all clients that the user is online
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                event: "userConnected",
                data: {
                  id: updatedUser.id,
                  name: updatedUser.contactPersonName,
                  email: updatedUser.email,
                  isOnline: updatedUser.isOnline,
                },
              })
            );
          }
        });

        // Listen for messages from clients (e.g., status updates)
        ws.on("message", (message: any) => {
          try {
            const parsedMessage = JSON.parse(message.toString());

            if (parsedMessage.event === "updateStatus") {
              // Broadcast updated status to all clients
              wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(
                    JSON.stringify({
                      event: "statusChanged",
                      data: parsedMessage.data,
                    })
                  );
                }
              });
            }
          } catch (error) {
          }
        });

        // Handle socket disconnection
        ws.on("close", async () => {

          try {
            // Update user status to offline in the database
            const updatedUser = await prisma.user.update({
              where: { id: decoded.id },
              data: { isOnline: false },
            });

            // Broadcast to all clients that the user is offline
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    event: "userDisconnected",
                    data: {
                      id: updatedUser.id,
                      isOnline: updatedUser.isOnline,
                    },
                  })
                );
              }
            });
          } catch (error) {
            console.error("Error updating user offline status:", error);
          }
        });
      } catch (error) {
        console.error("Error updating user online status:", error);
      }
    }
  );
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📂 Upload directory: ${getUploadDirectory()}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
