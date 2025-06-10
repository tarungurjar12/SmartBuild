
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col flex-1">
      {/* Header Skeleton */}
      <div className="flex h-16 items-center gap-4 border-b bg-card px-6">
        <Skeleton className="h-8 w-8 md:hidden" /> {/* Mobile trigger */}
        <Skeleton className="h-6 w-32 hidden md:block" /> {/* Page Title */}
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" /> {/* Notification Icon */}
          <Skeleton className="h-8 w-8 rounded-full" /> {/* User Avatar */}
        </div>
      </div>
      {/* Page Content Skeleton */}
      <div className="p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
        </div>
        <Skeleton className="h-64 rounded-lg w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96 rounded-lg" />
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
