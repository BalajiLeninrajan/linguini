import { Suspense } from 'react';
import GroupLeaderboardComponent from '~/app/_components/groupLeaderboardComponent';
export const dynamic = 'force-dynamic'; 

export default function Page() {
  return (
    <Suspense fallback={<p>Loading leaderboard...</p>}>
      <GroupLeaderboardComponent />
    </Suspense>
  );
}