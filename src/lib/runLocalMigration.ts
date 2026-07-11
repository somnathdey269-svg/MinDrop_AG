// Runs once after a successful sign-in: pushes on-device memories into the
// user's account. Safe to call multiple times — server checks profiles.migrated_local_at.
import { toast } from "sonner";
import { migrateLocalMemories } from "@/lib/localMigration.functions";

const MEM_KEY = "memoryos.memories.v1";
const RAN_KEY = "mindrop.localMigrationRan.v1";

type LocalMemory = {
  id?: string;
  text?: string;
  category?: string;
  dueAt?: string;
  firedAt?: string;
  deletedAt?: string;
  metadata?: Record<string, unknown>;
};

export async function runLocalMemoryMigration(): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.sessionStorage.getItem(RAN_KEY) === "1") return;
  window.sessionStorage.setItem(RAN_KEY, "1");

  try {
    const raw = window.localStorage.getItem(MEM_KEY);
    const parsed: LocalMemory[] = raw ? JSON.parse(raw) : [];
    const memories = parsed
      .filter((m) => m && typeof m.id === "string" && m.id.length > 0)
      .map((m) => ({
        id: m.id as string,
        text: m.text ?? null,
        category: m.category ?? null,
        dueAt: m.dueAt ?? null,
        firedAt: m.firedAt ?? null,
        deletedAt: m.deletedAt ?? null,
        metadata: m.metadata ?? null,
      }));

    const res = await migrateLocalMemories({ data: { memories } });
    if (res.imported > 0 && !res.alreadyMigrated) {
      toast.success(
        res.imported === 1
          ? "1 memory synced to your account"
          : `${res.imported} memories synced to your account`,
      );
    }
  } catch {
    // silent — user is signed in either way; sync retries next visit
    window.sessionStorage.removeItem(RAN_KEY);
  }
}
