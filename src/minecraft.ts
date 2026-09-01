import { execFile } from "child_process";

const RCON_PASSWORD = process.env.MINECRAFT_RCON_PASSWORD || "";
const RCON_PORT = process.env.MINECRAFT_RCON_PORT || "25575";
const RCON_HOST = "127.0.0.1";

export const runMinecraftCommand = (command: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        execFile(
            "mcrcon",
            [
                "-H", RCON_HOST,
                "-P", RCON_PORT,
                "-p", RCON_PASSWORD,
                command
            ],
            (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(stderr || error.message));
                    return;
                }

                resolve(stdout.trim());
            }
        );
    });
};

export const getOnlinePlayers = async (): Promise<string[]> => {
    const output = await runMinecraftCommand("list");

    const lines = output
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

    if (lines.length < 2) {
        return [];
    }

    return lines[1]
        .split(",")
        .map(player => player.trim())
        .map(player => player.replace(/^default\\?:/, "").replace(/\\([_])/g, "$1"))
        .filter(Boolean);
};

export const getChickenKills = async (
    player: string
): Promise<number> => {
    try {
        const output = await runMinecraftCommand(
            `scoreboard players get ${player} chickenKills`
        );

        const match = output.match(/has (\d+)/);

        return match ? Number(match[1]) : 0;

    } catch {
        return 0;
    }
};