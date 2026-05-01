import Link from "next/link";
import Toggle from "../components/Toggle";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <>
      <Toggle />
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Sentinel Africa</h1>
        <p className="text-muted-foreground">
          If you can see this, Sentinel is live! ✅
        </p>
        <div>
          <Link
            href="/demo"
            className="border rounded-sm tracking-non px-3 py-2"
          >
            <span className="">Launch App</span>
          </Link>
        </div>
      </div>
    </>
  );
}
