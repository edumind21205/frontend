import React from "react";
import { ThemeToggle } from "../components/theme-toggle";

export default function ThemeTogglePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors">
      <h1 className="text-3xl font-bold mb-6">Theme Toggle Demo</h1>
      <div className="mb-4">
        <ThemeToggle />
      </div>
      <p className="text-lg text-center max-w-xl">
        Use the button above to switch between Light, Dark, and System themes. This will update the theme globally, including the Header and all pages.
      </p>
    </div>
  );
}
