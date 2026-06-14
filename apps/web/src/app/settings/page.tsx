import { getContentDir } from "@/lib/config";
import { getKeyStatus } from "@/lib/settings";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const contentDir = getContentDir();
  const keys = getKeyStatus();

  return (
    <div className="content-inner">
      <h1>Settings</h1>
      <p style={{ color: "var(--text-muted)", margin: "4px 0 32px", fontSize: "14px" }}>
        Configure API keys and local paths for this design system docs instance.
      </p>
      <SettingsForm contentDir={contentDir} initialKeys={keys} />
    </div>
  );
}
