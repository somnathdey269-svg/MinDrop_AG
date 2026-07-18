import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/why-mindrop")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
