
import { AppSidebar } from "@/components/layout/AppSidebar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppSidebar>
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>
    </AppSidebar>
  );
}
