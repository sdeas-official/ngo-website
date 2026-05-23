export const dynamic = "force-dynamic";

import { createDatabasesClient } from "@/lib/appwriteClient";

export async function GET() {
  try {
    const { databases, config } = createDatabasesClient();

    const response = await databases.listDocuments(
      config.databaseId,
      config.collections.home,
      [],
    );

    return Response.json({
      success: true,
      documents: response.total,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
