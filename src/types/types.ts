interface PageRecordInformation {
  id: string;
  title: string; // TODO: parsing required
  contentIds: string[];
  version: number;
  createdTime: string;
  lastEditedTime: string;
}

type JsonTypes = string | number | boolean | Date | Json | JsonArray;
interface Json {
  [x: string]: JsonTypes;
}
type JsonArray = Array<JsonTypes>;
