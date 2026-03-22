import { Query } from "appwrite";
import { NextResponse } from "next/server";
import {
  createDatabasesClient,
  getAppwriteConfig,
} from "../../../../lib/appwriteClient";

export async function POST(request) {
  try {
    const body = await request.json();
    const enteredId = String(body?.id ?? "").trim();
    const enteredPassword = String(body?.password ?? "").trim();

    if (!enteredId || !enteredPassword) {
      return NextResponse.json(
        { success: false, message: "Enter both ID and password." },
        { status: 400 },
      );
    }

    const { databases, config } = createDatabasesClient();
    const adminCollectionId = getAppwriteConfig().collections.admin;

    if (!databases || !config.databaseId || !adminCollectionId) {
      return NextResponse.json(
        { success: false, message: "Admin auth is not configured." },
        { status: 500 },
      );
    }

    const result = await databases.listDocuments(
      config.databaseId,
      adminCollectionId,
      [Query.limit(100)],
    );

    const adminRecord = result.documents.find((doc) => {
      const dbId = String(doc?.id ?? "").trim();
      if (dbId !== enteredId) return false;

      const dbPasswordRaw = doc?.password;
      const stringMatch =
        String(dbPasswordRaw ?? "").trim() === enteredPassword;
      const numericMatch =
        !Number.isNaN(Number(enteredPassword)) &&
        Number(dbPasswordRaw) === Number(enteredPassword);

      return stringMatch || numericMatch;
    });

    if (!adminRecord) {
      return NextResponse.json(
        { success: false, message: "Invalid ID or password." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to complete login." },
      { status: 500 },
    );
  }
}
