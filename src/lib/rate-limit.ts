import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Configuration: Allow a maximum of 5 requests per 60 seconds for high-risk routes
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 5;

export async function isRateLimited(ip: string, route: string): Promise<boolean> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - WINDOW_MS);

    try {
        // 1. Count how many times this IP has hit this specific route within the time window
        const requestCount = await prisma.rateLimit.count({
            where: {
                ip,
                route,
                timestamp: {
                    gte: windowStart,
                },
            },
        });

        // 2. If they exceeded the threshold, block them immediately
        if (requestCount >= MAX_REQUESTS) {
            return true;
        }

        // 3. Otherwise, log this current request timestamp in the database
        await prisma.rateLimit.create({
            data: { ip, route, timestamp: now },
        });

        // Background Cleanup: Periodically delete records older than our window to keep Neon tidy
        // In a production environment, you would run this inside a cron job, but we run it asynchronously here
        prisma.rateLimit.deleteMany({
            where: {
                timestamp: {
                    lt: windowStart,
                },
            },
        }).catch((err) => console.error("Rate limit cleanup error:", err));

        return false;
    } catch (error) {
        console.error("Rate limiting engine failure:", error);
        // Fail-open: If our rate limiter encounters an issue, we let the request pass
        // so we don't break user access entirely (Graceful Degradation)
        return false;
    }
}