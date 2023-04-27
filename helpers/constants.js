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
    { name: "body", id: 1, type: "richtext" }, // can't instantiate with ItemProperty class due to circular reference
    { name: "author", id: 2, type: "string" },
    { name: "draft", id: 3, type: "boolean" },
    { name: "date", id: 4, type: "date" },
  ],
};
