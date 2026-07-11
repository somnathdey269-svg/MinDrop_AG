import { createFileRoute, redirect } from "@tanstack/react-router";

/** Deprecated: real sign in lives at /auth. Keep the route so old links still resolve. */
export const Route = createFileRoute("/signin")({
  beforeLoad: () => { throw redirect({ to: "/auth" }); },
  component: () => null,
});
