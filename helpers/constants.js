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
  collectionItemPropertyTypes: {
    string: "string",
    richText: "richtext",
    boolean: "boolean",
    date: "date",
    file: "file",
  },
  collectionItemDefaultProperties: {
    author: { name: "author", type: "string", required: true },
    date: { name: "date", type: "date", required: true },
    published: { name: "published", type: "boolean", required: true },
    body: { name: "body", type: "richtext", required: false },
  },
};

export const UICMS_CONFIG_STARTER_TEMPLATE = {
  websiteName: "",
  websiteUrl: "",
  assetsDirectory: UICMS_CONFIGS.defaultAssetsDirectory,
  collectionsDirectory: UICMS_CONFIGS.defaultCollectionsDirectory,
  collections: [],
};

export const UICMS_TOPIC = "uicms"; // to be used as a topic in GitHub repos
