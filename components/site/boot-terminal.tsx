import { allProjects } from "@/lib/projects";
import { cssVars } from "@/lib/utils";

const COMMAND = "open ./work";

const OUTPUT = ["waking up sambilaycord OS…", "brewing coffee… done", `opening ${allProjects.length} projects`];

/**
 * The laptop's start-up, split across two scenes. The about scene types the command once the
 * login goes through (`--typed`), and the desktop chapter picks it up already typed, prints
 * the output (`--line-0`…) and then dissolves into the desktop. Both halves render this, so
 * the hand-over between the scenes is seamless.
 */
export function BootTerminal({ withOutput }: { withOutput: boolean }) {
  return (
    // The output hangs below the command rather than adding to the block's height, so the
    // command line sits in exactly the same place in both scenes.
    <div aria-hidden="true" className="boot-terminal relative font-mono text-sm sm:text-base">
      <p>
        <span className="text-brand-accent-3">~/sambilaycord</span> <span className="text-brand-on-cocoa/50">$</span>{" "}
        <span className="boot-command" style={cssVars({ "--chars": String(COMMAND.length) })}>
          {COMMAND}
        </span>
        {!withOutput && <span className="desk-caret">▍</span>}
      </p>
      {withOutput && (
        <ul className="absolute inset-x-0 top-full mt-3 space-y-1.5 text-brand-on-cocoa/70">
          {OUTPUT.map((line, index) => (
            <li key={line} className="boot-line" style={cssVars({ "--line": `var(--line-${index}, 1)` })}>
              <span className="text-brand-accent-3">→</span> {line}
            </li>
          ))}
          <li className="boot-line" style={cssVars({ "--line": `var(--line-${OUTPUT.length}, 1)` })}>
            <span className="desk-caret">▍</span>
          </li>
        </ul>
      )}
    </div>
  );
}
