import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (isProduction ? "info" : "debug"),

  // Pretty print in development
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
          singleLine: false,
          messageFormat: "{correlationId} {msg}",
        },
      }
    : undefined,

  // Production format - JSON for log aggregation systems
  formatters: isProduction
    ? {
        level: (label) => {
          return { level: label };
        },
      }
    : undefined,

  // Base fields for all logs
  base: {
    env: process.env.isDevelopment ?? "development",
    service: "ticket-booking-system-api",
  },

  // Serialize errors properly
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
});
