export const IRON_SESSION_OPTIONS = {
  password: process.env.IRON_SESSION_COOKIE_PASSWORD,
  cookieName: "ironSessionCookie",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // secure only in production (https), can't be in development (http)
  },
};

export const UICMS_CONFIGS = {
  fileName: "uicms.config.json",
  defaultAssetsDirectory: "_contents/assets", // has to be a folder that will be present after build
  defaultCollectionsDirectory: "_contents/collections", // has to be a folder that will be present after build
  topic: "uicms", // to be used as a topic in GitHub repos
  collectionItemPropertyTypes: {
    string: "string",
    richtext: "richtext",
    boolean: "boolean",
    date: "date",
    file: "file",
  },
  collectionItemDefaultProperties: [
    { name: "Author", id: "author", type: "string", required: true },
    { name: "Body", id: "body", type: "richtext", required: false },
    { name: "Published", id: "published", type: "boolean", required: true },
    { name: "Date", id: "date", type: "date", required: true },
  ],
};
