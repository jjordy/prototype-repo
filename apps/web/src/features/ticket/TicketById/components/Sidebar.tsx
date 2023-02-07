import { Card } from "@jjordy/ui";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-1/6 flex-col items-stretch">
      <Card className="h-full max-h-screen">
        <div className="flex flex-col space-y-4">{children}</div>
      </Card>
    </div>
  );
}
