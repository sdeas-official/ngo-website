// Schemas for the read-only "Inbox" channels (form submissions).
//
// Each channel declares how list rows render and which read-only fields the
// detail panel shows. Field source keys fall back across the historical aliases
// the legacy panel tolerated (e.g. fullName || name, phoneNo || phone).
//
// `actions` describes available row/detail actions:
//   approve -> writes { approved: true }
//   delete  -> hard delete (used for reject)

export const registrationsChannel = {
  key: "registrations",
  label: "Registrations",
  collectionKey: "registrations",
  orderDesc: "$createdAt",
  list: {
    // name built from firstName + lastName; subtitle = email
    titleFields: ["firstName", "lastName"],
    subtitleField: "email",
    statusField: "approved",
  },
  detail: {
    fields: [
      { label: "First name", keys: ["firstName"] },
      { label: "Last name", keys: ["lastName"] },
      { label: "Email", keys: ["email"] },
      { label: "Phone number", keys: ["phoneNumber"] },
      { label: "Submitted", keys: ["$createdAt"], type: "datetime" },
    ],
  },
  actions: { approve: true, reject: true },
};

export const contactChannel = {
  key: "contact",
  label: "Contact Requests",
  collectionKey: "responses",
  orderDesc: "$createdAt",
  list: {
    titleKeys: ["fullName", "name"],
    subtitleKeys: ["subject"],
  },
  detail: {
    fields: [
      { label: "Full name", keys: ["fullName", "name"] },
      { label: "Email", keys: ["email"] },
      { label: "Phone number", keys: ["phoneNo", "phone"] },
      { label: "Received", keys: ["$createdAt"], type: "datetime" },
      { label: "Subject", keys: ["subject"] },
      { label: "Message", keys: ["message"], type: "longtext" },
    ],
  },
  actions: { delete: true },
};

export const partnerChannel = {
  key: "partner",
  label: "Partner Requests",
  collectionKey: "partnerResponses",
  orderDesc: "$createdAt",
  list: {
    titleKeys: ["name"],
    subtitleKeys: ["location"],
  },
  detail: {
    fields: [
      { label: "Full name", keys: ["name"] },
      { label: "Email", keys: ["email"] },
      { label: "Phone number", keys: ["phoneNo"] },
      { label: "Location", keys: ["location"] },
      { label: "Availability", keys: ["availability"] },
      { label: "Received", keys: ["$createdAt"], type: "datetime" },
      { label: "Skills & expertise", keys: ["skills"], type: "longtext" },
    ],
  },
  actions: { delete: true },
};

export const inboxByKey = {
  registrations: registrationsChannel,
  contact: contactChannel,
  partner: partnerChannel,
};
