// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";
// import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://44d0d911d2d142a09af9880e447fc28b@o4508579655450624.ingest.us.sentry.io/4508579660824576",
  integrations: [/*nodeProfilingIntegration(),*/ Sentry.mongoIntegration()],
  // Tracing
  //tracesSampleRate: 1.0, //  Capture 100% of the transactions
});
// Manually call startProfiler and stopProfiler
// to profile the code in between
// Sentry.profiler.startProfiler();

