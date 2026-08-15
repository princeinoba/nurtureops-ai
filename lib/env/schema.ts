import { z } from "zod";

const optionalUrl = z.preprocess((value) => (value === "" ? undefined : value), z.url().optional());
const optionalSecret = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(24).optional(),
);

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().min(16).optional(),
  ),
});

const serverSchema = publicSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: optionalSecret,
  AI_GATEWAY_API_KEY: optionalSecret,
  AI_MODEL: z.preprocess((value) => (value === "" ? undefined : value), z.string().optional()),
  APP_URL: z.url().default("http://localhost:3000"),
  CRON_SECRET: optionalSecret,
  INVITATION_HMAC_SECRET: optionalSecret,
  NURTUREOPS_DEMO_MODE: z.enum(["true", "false"]).default("true"),
  AI_ENABLED: z.enum(["true", "false"]).default("false"),
});

export type PublicEnvironment = z.infer<typeof publicSchema>;
export type ServerEnvironment = z.infer<typeof serverSchema>;

export function readPublicEnvironment(
  source: Record<string, string | undefined> = process.env,
): PublicEnvironment {
  return publicSchema.parse(source);
}

export function readServerEnvironment(
  source: Record<string, string | undefined> = process.env,
): ServerEnvironment {
  const environment = serverSchema.parse(source);
  if (environment.NURTUREOPS_DEMO_MODE === "false") {
    if (
      !environment.NEXT_PUBLIC_SUPABASE_URL ||
      !environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ) {
      throw new Error("Operational mode requires Supabase public configuration.");
    }
  }
  if (
    environment.AI_ENABLED === "true" &&
    (!environment.AI_GATEWAY_API_KEY || !environment.AI_MODEL)
  ) {
    throw new Error("AI_ENABLED requires server-only gateway credentials and an explicit model.");
  }
  return environment;
}
