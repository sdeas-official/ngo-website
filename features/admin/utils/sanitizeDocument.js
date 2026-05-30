// Strips Appwrite system fields ($id, $collectionId, etc.) from a document,
// leaving only the user-editable attributes. Extracted verbatim from the
// legacy admin panel so the read/write contract is identical.
export function sanitizeDocument(data) {
  const clean = { ...data };
  delete clean.$id;
  delete clean.$collectionId;
  delete clean.$databaseId;
  delete clean.$permissions;
  delete clean.$createdAt;
  delete clean.$updatedAt;
  return clean;
}
