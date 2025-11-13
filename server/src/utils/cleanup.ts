// import cron from "node-cron";
// import db from "../db";
// import { sql } from "drizzle-orm";

// cron.schedule("*/5 * * * *", async () => {
//   try {
//     const result = await db.execute(sql`
//       DELETE FROM tokens
//       WHERE expires_at <= now() AND revoked_at IS NULL
//     `);
//     console.log(`[CRON] Expired tokens cleaned up at ${new Date().toISOString()}. Deleted ${result.rowCount} tokens.`);
//   } catch (error) {
//     console.error("[CRON] Error cleaning expired tokens:", error);
//   }
// });
