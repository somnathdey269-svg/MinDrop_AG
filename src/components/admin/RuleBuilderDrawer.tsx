import { motion, AnimatePresence } from "framer-motion";
import type { Rule } from "@/lib/memoryos/types";

interface Props {
  rule: Rule | null;
  onClose: () => void;
}

function Block({ label, n, children }: { label: string; n: number; children: React.ReactNode }) {
  return (
    <div className="relative p-5 bg-canvas/40 border border-ink/10 rounded-2xl">
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 size-6 bg-brand rounded-full grid place-items-center text-[10px] text-canvas font-bold">
        {n}
      </div>
      <span className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">{label}</span>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function RuleBuilderDrawer({ rule, onClose }: Props) {
  return (
    <AnimatePresence>
      {rule && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-canvas z-50 overflow-y-auto"
          >
            <div className="p-8 lg:p-12 space-y-10">
              <header className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-1">
                    Visual Rule Builder
                  </p>
                  <h2 className="text-3xl font-serif">{rule.name}</h2>
                  <p className="text-xs text-ink/50 mt-1">
                    {rule.version} · Priority {rule.priority}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-[10px] font-bold uppercase tracking-widest text-ink/50 hover:text-ink"
                >
                  Close
                </button>
              </header>

              <div className="space-y-4 pl-3">
                <Block label="When" n={1}>
                  <p className="text-sm font-medium">{rule.trigger}</p>
                </Block>
                <div className="h-6 w-px bg-ink/10 ml-9" />
                <Block label="If" n={2}>
                  <div className="space-y-2">
                    {rule.conditions.map((c) => (
                      <div
                        key={c}
                        className="px-3 py-2 bg-white rounded-lg border border-ink/5 text-xs font-mono text-ink/80"
                      >
                        {c}
                      </div>
                    ))}
                    <button className="text-[10px] font-bold uppercase tracking-widest text-brand">
                      + Add Condition
                    </button>
                  </div>
                </Block>
                <div className="h-6 w-px bg-ink/10 ml-9" />
                <Block label="Then" n={3}>
                  <p className="text-sm font-medium">
                    Execute <span className="text-brand">{rule.action}</span>
                  </p>
                </Block>
              </div>

              <div className="border-t border-ink/10 pt-6 flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-ink/40">Version</p>
                  <p className="text-sm font-mono mt-1">{rule.version} → next draft</p>
                </div>
                <button className="px-5 py-3 rounded-xl bg-ink text-canvas text-[10px] font-bold uppercase tracking-widest">
                  Deploy New Version
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
