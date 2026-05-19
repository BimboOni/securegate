import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

export async function isRateLimited(ip: string, route: string): Promise<boolean> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - WINDOW_MS);

    try {
        const requestCount = await prisma.rateLimit.count({
            where: {
                ip,
                route,
                timestamp: { gte: windowStart },
            },
        });

        if (requestCount >= MAX_REQUESTS) {
            return true;
        }

        await prisma.rateLimit.create({
            data: { ip, route, timestamp: now },
        });

        prisma.rateLimit.deleteMany({
            where: { timestamp: { lt: windowStart } },
        }).catch((err) => console.error("Rate limit cleanup error:", err));

        return false;
    } catch (error) {
        console.error("Rate limiting engine failure:", error);
        return false;
    }
}
