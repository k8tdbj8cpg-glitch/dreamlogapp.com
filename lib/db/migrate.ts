
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";



const runMigrate = async () => {  
  if (!process.env.POSTGRES_URL) {
  console.error("❌ POSTGRES_URL environment variable is missing.");
  console.error("Cannot run without a valid connection string.");
  console.error("Set POSTGRES_URL in your environment settings and redeploy.");
  process.exit(1);
}
  console.log("⏳ Running migrations...");
  try {
    const dbUrl = new URL(process.env.POSTGRES_URL);
    dbUrl.username = "<redacted>";
    dbUrl.password = "<redacted>";
    console.log("   Connecting to database:", dbUrl.toString());
  } catch {
    console.log("   Connecting to database: <unparseable URL>");
  }

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection);

  const start = Date.now();
  await migrate(db, { migrationsFolder: "./lib/db/migrations" });
  const end = Date.now();

  console.log("✅ Migrations completed successfully in", end - start, "ms");
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
