import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { stubPlayers } from "./seed";

const db = new Database(":memory:");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");
db.exec(schema);

const insertPlayer = db.prepare(
  "INSERT INTO players (id, name, country, position, goals, caps) VALUES (?, ?, ?, ?, ?, ?)"
);

for (const player of stubPlayers) {
  insertPlayer.run(
    player.id,
    player.name,
    player.country,
    player.position,
    player.goals,
    player.caps
  );
}

export { db };
