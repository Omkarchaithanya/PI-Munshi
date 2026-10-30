import { createFileRoute } from "@tanstack/react-router";
import { CommandCenter } from "@/components/munshi/command";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <CommandCenter />;
}
