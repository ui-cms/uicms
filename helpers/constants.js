export const IRON_SESSION_OPTIONS = {
  password: process.env.IRON_SESSION_COOKIE_PASSWORD,
  cookieName: "ironSessionCookie",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // secure only in production (https), can't be in development (http)
  },
};

// Note that ^ symbol negates
export const REGEXES = {
  GlobalAlphanumeric_Underscore: /[^\p{L}0-9_]+/ug, // Letters from any language, numbers, underscore
  EnglishAlphanumeric_Underscore: /[^a-zA-Z0-9_]+/g, // English letters, numbers, underscore
  EnglishAlphanumeric_Underscore_Slash: /[^a-zA-Z0-9_/]+/g, // English letters, numbers, underscore, slash
};

export const UICMS_CONFIGS = {
  fileName: "uicms.config.json",
  defaultCollectionsDirectory: "_collections", // has to be a folder that will be present after build
  topic: "uicms", // to be used as a topic in GitHub repos
  collectionItemPropertyTypes: {
    string: "string",
    richtext: "richtext",
    boolean: "boolean",
    date: "date",
    file: "file",
  },
  collectionItemDefaultProperties: [
    { name: "title", id: 1, type: "string" },
    { name: "author", id: 2, type: "string" },
    { name: "draft", id: 3, type: "boolean" },
    { name: "date", id: 4, type: "date" },
    { name: "body", id: 5, type: "richtext" }, // can't instantiate with ItemProperty class due to circular reference
  ],
};
