import { createDatabasesClient } from "@/lib/appwriteClient";

export async function GET() {
  try {
    const { databases, config } = createDatabasesClient();

    if (!databases) {
      return Response.json(
        { status: "error", message: "Appwrite not configured" },
        { status: 500 },
      );
    }

    // 🔥 Minimal DB ping (safe + fast)
    await databases.listDocuments(
      config.databaseId,
      config.collections.home,
      [],
    );

    return Response.json({ status: "alive ✅" });
  } catch (error) {
    return Response.json(
      { status: "error", message: error.message },
      { status: 500 },
    );
  }
}
