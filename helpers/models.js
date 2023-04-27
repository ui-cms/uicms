import { UICMS_CONFIGS } from "./constants";

export class RepoConfigFile {
  data = null;
  sha = null; // SHA blob of config file. Use it to update file content/data.

  constructor(data = null, sha = null) {
    this.data = data;
    this.sha = sha;
  }
}

export class RepoConfigData {
  websiteName = "";
  websiteUrl = "";
  assetsDirectory = "";
  collectionsDirectory = "";
  collections = [];

  constructor() {
    this.assetsDirectory = UICMS_CONFIGS.defaultAssetsDirectory;
    this.collectionsDirectory = UICMS_CONFIGS.defaultCollectionsDirectory;
  }
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
  isNew = false; // newly created (e.i unsaved/temp)

  constructor() {
    this.isNew = true;
    this.id = new Date().getTime();
  }
}