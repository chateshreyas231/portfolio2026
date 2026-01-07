'use client';

import dynamic from 'next/dynamic';

// Dynamically import Three.js component to prevent SSR issues
const AIRobot3D = dynamic(
  () => import('./AIRobot3D'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white/50 text-xs">Loading...</div>
      </div>
    )
  }
);

// Wrapper component that handles mouse tracking
export default function AIRobot({ onClick }: { onClick?: () => void }) {
  return <AIRobot3D onClick={onClick} />;
}
