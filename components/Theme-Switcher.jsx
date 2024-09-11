"use client";

import * as React from "react";
import { Moon, MoonIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex justify-end fixed top-4 z-40 right-4">
      <Button variant="outline" className="p-2" aria-label="theme-switcher">
        {theme === "light" ? (
          <Sun onClick={() => setTheme("dark")} />
        ) : (
          <Moon onClick={() => setTheme("light")} />
        )}
      </Button>
    </div>
  );
}
