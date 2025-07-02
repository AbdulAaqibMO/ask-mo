'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ChatInterface = dynamic(
  () => import('@/components/ChatInterface'),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col h-screen max-w-4xl mx-auto bg-background">
        <div className="border-b p-4">
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-16 w-2/3 ml-auto" />
          <Skeleton className="h-16 w-3/4" />
        </div>
        <div className="border-t p-4">
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    ),
  }
);

export default function ChatPage() {
  return <ChatInterface />;
}
