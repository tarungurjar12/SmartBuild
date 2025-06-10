
"use client"; 

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] p-6 text-center">
      <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Oops, something went wrong!</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        An unexpected error occurred. You can try to refresh the page or contact support if the problem persists.
      </p>
      <p className="text-sm text-muted-foreground mb-4">Error: {error.message}</p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </Button>
    </div>
  );
}
