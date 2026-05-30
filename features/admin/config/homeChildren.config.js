// Collection configs for the two list-style sub-sections of the Home page:
// the homepage program cards (max 3) and the events & updates entries.
// Same shape as collections.config.js so they reuse RecordEditor / RecordListPanel.
// toForm tolerates the legacy field aliases the old panel accepted.

const str = (v) => (typeof v === "string" ? v : "");

export const homeProgramsChild = {
  key: "homePrograms",
  label: "Program Cards",
  singular: "Program Card",
  collectionKey: "homeOurPrograms",
  backHref: "/admin/pages/home",
  max: 3,
  list: {
    titleKeys: ["programTitle", "ourProgrammsTitle"],
    subtitleKeys: ["programDescription", "ourProgrammsText"],
    imageField: "programImage",
  },
  editor: {
    groups: [
      {
        title: "Card",
        fields: [
          { key: "programTitle", label: "Program title", type: "text", required: true },
          { key: "programImage", label: "Program image", type: "image", required: true },
          { key: "programDescription", label: "Program text", type: "textarea", required: true, big: true },
        ],
      },
    ],
  },
  emptyValues: { programTitle: "", programImage: "", programDescription: "" },
  toForm(doc) {
    return {
      programTitle: str(doc.programTitle) || str(doc.ourProgrammsTitle),
      programImage: str(doc.programImage) || str(doc.ourProgrammsImage),
      programDescription: str(doc.programDescription) || str(doc.ourProgrammsText),
    };
  },
  toPayload(form) {
    return {
      programTitle: (form.programTitle || "").trim(),
      programDescription: (form.programDescription || "").trim(),
      programImage: (form.programImage || "").trim(),
    };
  },
};

export const homeEventsChild = {
  key: "homeEvents",
  label: "Events & Updates",
  singular: "Event",
  collectionKey: "homeEventsUpdates",
  backHref: "/admin/pages/home",
  list: {
    titleKeys: ["title", "EventsHeading"],
    subtitleKeys: ["text", "EventsText"],
    imageField: "image",
  },
  editor: {
    groups: [
      {
        title: "Event",
        fields: [
          { key: "EventsHeading", label: "Event heading", type: "text", required: true },
          { key: "EventsImage", label: "Event image", type: "image", required: true },
          { key: "EventsText", label: "Event text", type: "textarea", required: true, big: true },
        ],
      },
    ],
  },
  emptyValues: { EventsHeading: "", EventsImage: "", EventsText: "" },
  toForm(doc) {
    return {
      EventsHeading: str(doc.title) || str(doc.EventsHeading),
      EventsImage: str(doc.image) || str(doc.EventsImage),
      EventsText: str(doc.text) || str(doc.EventsText),
    };
  },
  toPayload(form) {
    return {
      title: (form.EventsHeading || "").trim(),
      text: (form.EventsText || "").trim(),
      image: (form.EventsImage || "").trim(),
    };
  },
};

export const homeChildrenByKey = {
  programs: homeProgramsChild,
  events: homeEventsChild,
};
