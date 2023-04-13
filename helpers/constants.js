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
  collectionItemDefaultProperties: [
    { name: "Author", id: "author", type: "string", required: true },
    { name: "Date", id: "date", type: "date", required: true },
    { name: "Published", id: "published", type: "boolean", required: true },
    { name: "Body", id: "body", type: "richtext", required: false },
  ],
  uniqueKeyLength: 8, // e.g collection ids
};

export const UICMS_CONFIG_TEMPLATE = {
  websiteName: "",
  websiteUrl: "",
  assetsDirectory: UICMS_CONFIGS.defaultAssetsDirectory,
  collectionsDirectory: UICMS_CONFIGS.defaultCollectionsDirectory,
  collections: [],
};

export const UICMS_CONFIG_COLLECTION_TEMPLATE={
  id: null,
  name:"",
  path:"",
  item:{
    name: "",
    properties:[]
  }
}

export const UICMS_TOPIC = "uicms"; // to be used as a topic in GitHub repos
