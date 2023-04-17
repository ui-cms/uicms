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
    string: 1,
    richText: 2,
    boolean: 3,
    date: 4,
    file: 5,
  },
  collectionItemDefaultProperties: [
    { name: "Author", id: "author", type: 1, required: true },
    { name: "Body", id: "body", type: 2, required: false },
    { name: "Published", id: "published", type: 3, required: true },
    { name: "Date", id: "date", type: 4, required: true },
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
