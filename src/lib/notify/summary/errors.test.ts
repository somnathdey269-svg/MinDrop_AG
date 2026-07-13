import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { classify } from "./errors";

describe("errors classify function", () => {
  // Mock navigator.onLine since we want to fully control environment during test runs
  const originalOnLine = navigator.onLine;

  beforeAll(() => {
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      get: () => true,
    });
  });

  afterAll(() => {
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      get: () => originalOnLine,
    });
  });

  it("classifies offline error when network is disconnected", () => {
    // Redefine onLine stub to return false for this test
    vi.spyOn(navigator, "onLine", "get").mockReturnValueOnce(false);

    const error = new Error("Any error");
    const friendly = classify(error);

    expect(friendly.kind).toBe("offline");
    expect(friendly.title).toBe("You're offline");
    expect(friendly.cause).toBe("This device has no internet connection.");
    expect(friendly.fixSteps).toContain("Reconnect Wi-Fi or mobile data.");
  });

  it("classifies invalid api key errors (correct detection of invalid key status/message)", () => {
    const errorWithStatus = { status: 401, message: "Unauthorized" };
    const friendly1 = classify(errorWithStatus, { provider: "Gemini" });
    expect(friendly1.kind).toBe("invalid_key");
    expect(friendly1.cause).toBe("Gemini rejected your API key.");

    const errorWithMessage = new Error("invalid api key provided");
    const friendly2 = classify(errorWithMessage, { provider: "OpenAI" });
    expect(friendly2.kind).toBe("invalid_key");
  });

  it("classifies insufficient quota/billing errors and resolves redirect dashboard links", () => {
    const errorQuota = new Error("insufficient quota inside account");
    const friendly = classify(errorQuota, { provider: "openai" });

    expect(friendly.kind).toBe("insufficient_credit");
    expect(friendly.action?.href).toBe("https://platform.openai.com/settings/organization/billing/overview");
  });

  it("classifies rate limit errors and extracts numeric retryAfter values using custom retry regex handles", () => {
    const errorRateSec = new Error("Rate limit exceeded. Please retry after 42 seconds.");
    const friendly1 = classify(errorRateSec);

    expect(friendly1.kind).toBe("rate_limit");
    expect(friendly1.retryAfterSec).toBe(42);

    const errorRateDefault = { status: 429, message: "Too many requests" };
    const friendly2 = classify(errorRateDefault);

    expect(friendly2.kind).toBe("rate_limit");
    expect(friendly2.retryAfterSec).toBe(30); // Default fallback retry seconds is 30
  });

  it("classifies forbidden model access", () => {
    const errorForbidden = { status: 403, message: "Model is not allowed for your access tier" };
    const friendly = classify(errorForbidden, { model: "claude-3-5-sonnet" });

    expect(friendly.kind).toBe("model_forbidden");
    expect(friendly.title).toBe("This key can't use claude-3-5-sonnet");
  });

  it("classifies cors and network blockades", () => {
    const errorCors = new Error("blocked by CORS policy restriction");
    const friendly = classify(errorCors);

    expect(friendly.kind).toBe("cors_blocked");
  });

  it("classifies timeout errors", () => {
    const errorTimeout = new Error("request aborted due to timeout");
    const friendly = classify(errorTimeout);

    expect(friendly.kind).toBe("timeout");
  });

  it("classifies invalid json parsing outputs", () => {
    const errorJson = new Error("Unexpected token < in JSON at position 0");
    const friendly = classify(errorJson);

    expect(friendly.kind).toBe("bad_json");
  });

  it("classifies device storage full warnings", () => {
    const errorStorage = new Error("quota exceeded: local storage is full");
    const friendly = classify(errorStorage);

    expect(friendly.kind).toBe("storage_full");
  });

  it("handles unknown error shapes gracefully", () => {
    const errorUnknown = new Error("some random brand new error format");
    const friendly = classify(errorUnknown);

    expect(friendly.kind).toBe("unknown");
    expect(friendly.title).toBe("Something went wrong");
  });
});
