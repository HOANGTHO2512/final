import { connectDB } from "@/lib/db/mongodb";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const mongoUri = process.env.MONGO_URI;

    // Check if MONGO_URI exists
    if (!mongoUri) {
      return NextResponse.json(
        {
          status: "❌ FAILED",
          message: "MONGO_URI not found in environment variables",
          solution:
            "Create .env.local file in root directory with: MONGO_URI=your_mongodb_connection_string",
          envVars: {
            MONGO_URI: "undefined",
            NODE_ENV: process.env.NODE_ENV,
          },
        },
        { status: 400 },
      );
    }

    console.log("🔍 Testing MongoDB connection...");
    console.log("📍 MONGO_URI (partial):", mongoUri.substring(0, 40) + "...");

    // Test connection using connectDB
    const connection = await connectDB();

    // Get detailed connection info
    const dbStatus = {
      status: "✅ SUCCESS",
      message: "MongoDB connected successfully",
      timestamp: new Date().toISOString(),
      connection: {
        state: mongoose.connection.readyState,
        stateName: ["disconnected", "connected", "connecting", "disconnecting"][
          mongoose.connection.readyState
        ],
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        database: mongoose.connection.name,
        models: Object.keys(mongoose.models),
      },
      mongoUri: {
        protocol: mongoUri.split("://")[0],
        hasCredentials: mongoUri.includes("@"),
        cluster: mongoUri.match(/cluster[^.]+\.mongodb\.net/)?.[0] || "unknown",
      },
    };

    console.log("✅ MongoDB test successful!");
    return NextResponse.json(dbStatus);
  } catch (error) {
    console.error("❌ MongoDB test failed:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorCode = (error as any).code || "UNKNOWN";

    // Provide helpful error messages
    let solution = "";
    if (
      errorCode === "ECONNREFUSED" ||
      errorMessage.includes("querySrv ECONNREFUSED")
    ) {
      solution =
        "1. Check your internet connection\n2. Verify MongoDB Atlas cluster is running\n3. Check if IP address is whitelisted in MongoDB Atlas (Network Access)\n4. Verify connection string is correct";
    } else if (errorMessage.includes("authentication failed")) {
      solution =
        "Check your MongoDB username and password in connection string";
    } else if (errorMessage.includes("network")) {
      solution = "Network issue - check firewall or VPN settings";
    }

    return NextResponse.json(
      {
        status: "❌ FAILED",
        message: "MongoDB connection failed",
        error: errorMessage,
        errorCode,
        solution,
        mongoUri: process.env.MONGO_URI
          ? "Set (hidden for security)"
          : "Not set",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
