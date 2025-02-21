import * as dotenv from "dotenv";
dotenv.config();

export const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!BOT_TOKEN) {
    console.error("❌ Bot token is missing. Please check your .env file.");
    process.exit(1);
}

console.log("✅ Bot token loaded successfully.");