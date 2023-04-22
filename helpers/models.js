import { UICMS_CONFIGS } from "./constants";

export class UICMSConfig {
  websiteName = "";
  websiteUrl = "";
  assetsDirectory = UICMS_CONFIGS.defaultAssetsDirectory;
  collectionsDirectory = UICMS_CONFIGS.defaultCollectionsDirectory;
  collections = [];
}

export class Collection {
  id = null;
  name = "";
  path = "";
  item = {
    name: "",
    properties: [],
  };

  constructor() {
    this.id = new Date().getTime();
  }
}

export class ItemProperty {
  id = null;
  type = "";
  name = "";
  isNew; // newly created (e.i unsaved/temp)

  constructor() {
    this.isNew = true;
    this.id = new Date().getTime();
  }
}
