import Dexie, { type EntityTable } from "dexie";
interface globalBackgroundImage {
  id?: number;
  picture?: string;
}
const db = new Dexie(import.meta.env["VITE_DATABASE_NAME"]) as Dexie & {
  globalBackgroundImage: EntityTable<globalBackgroundImage>;
  ToDoRecorderGlobalBackgroundImage: EntityTable<globalBackgroundImage>;
};

// Schema declaration:
db.version(1).stores({
  globalBackgroundImage: "++id",
  ToDoRecorderGlobalBackgroundImage: "++id",
});

export default db;
