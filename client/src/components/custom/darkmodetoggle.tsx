"use client";

import { useState, useEffect } from "react";
import { Switch } from "../ui/switch";
import { useTheme } from "next-themes";

const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [enabled, setEnabled] = useState(theme === "dark");

  useEffect(() => {
    setTheme(enabled ? "dark" : "light");
  }, [enabled, setTheme]);

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm">Dark Mode</span>
      <Switch
        checked={enabled}
        onCheckedChange={(checked) => setEnabled(checked)}
        className={`${enabled ? "bg-blue-600" : "bg-gray-200"}
          relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span
          className={`${enabled ? "translate-x-6" : "translate-x-1"}
            inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
    </div>
  );
};

export default DarkModeToggle;
