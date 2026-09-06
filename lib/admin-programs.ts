import { curriculum, type Module } from "@/lib/curriculum";
import { safetyCurriculum } from "@/lib/safety-curriculum";
import { streamingCurriculum } from "@/lib/streaming-curriculum";

/**
 * The training programs the admin progress views cover (issue #49). One entry
 * per shipped curriculum; add here when a new program's lessons land and both
 * the /admin matrix tabs and the per-person drill-in pick it up.
 */
export type AdminProgram = {
  key: string;
  label: string;
  icon: string;
  /** Route prefix its module pages live under (for deep links). */
  basePath: string;
  modules: Module[];
};

export const ADMIN_PROGRAMS: AdminProgram[] = [
  {
    key: "sound-tech",
    label: "Sound Tech",
    icon: "🎚️",
    basePath: "/learn",
    modules: curriculum,
  },
  {
    key: "safety",
    label: "Safety & Security",
    icon: "🛡️",
    basePath: "/safety",
    modules: safetyCurriculum,
  },
  {
    key: "streaming",
    label: "Live Streaming",
    icon: "🎥",
    basePath: "/streaming",
    modules: streamingCurriculum,
  },
];

export function adminProgram(key: string | undefined): AdminProgram {
  return ADMIN_PROGRAMS.find((p) => p.key === key) ?? ADMIN_PROGRAMS[0];
}
