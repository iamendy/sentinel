"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const Toggle = () => {
  const { theme, setTheme } = useTheme();

  const updateTheme = () => {
    const update = theme === "light" ? "dark" : "light";
    setTheme(update);
  };

  return (
    <div className="flex justify-center my-4">
      <div>
        <Button variant="outline" onClick={() => updateTheme()}>
          <span className="">Toggle theme</span>
        </Button>
      </div>
    </div>
  );
};
export default Toggle;
