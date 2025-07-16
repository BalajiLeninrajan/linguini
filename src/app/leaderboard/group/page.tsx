'use client'
import {useState, useEffect} from 'react';
import { Card, CardHeader, CardTitle} from '~/components/ui/card';
import Link from 'next/link';
import Header from '../../_components/header';
import LeaderboardContainer from '~/app/_components/leaderboardContainer';
import { api } from '~/trpc/react';
import type { userGroup } from '~/server/db';
import type { LeaderboardUser } from '~/types';
import { useSearchParams } from 'next/navigation';

export default function Leaderboard() {

    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [usergroups, setUserGroups] = useState<userGroup[]>([]);
    const [error, setError] = useState("");
    const [current, setCurrent] = useState("");
    const {data: recentGame} = api.leaderboard.getMostRecentGame.useQuery();
    const gameId = recentGame?.id?.toString() ?? "";
    const searchParams = useSearchParams();
    const groupId = searchParams.get('groupId')
    const groupName = searchParams.get('groupName')

    const currentUser = api.auth.currentUser.useQuery(undefined, {
        refetchOnWindowFocus: false,
    });
    // const currUserId = currentUser?.id;
    const currUserId = "1";

    const { data: userGroups, isLoading: groupsLoading, error: queryError } = api.leaderboard.getUserGroups.useQuery(
        { userId: currUserId }
    );

    const currentGroup = groupId && groupName ? {id: groupId, name: groupName} 
    : (userGroups as userGroup[])?.[0];

    console.log(currentGroup?.name)
   
    const { data: localLeaderboard, isLoading: isLoadingLeaderboard, error: leaderboardError } = api.leaderboard.getLocalLeaderboard.useQuery(
        {
            groupId: currentGroup?.id?.toString() ?? "",
            gameId: gameId
        },
        {
            enabled: !!currentGroup?.id && !!gameId
        }
    );

    useEffect(() => {
        if (userGroups && currentGroup) {
            setUserGroups(userGroups as userGroup[]);
            setCurrent(currentGroup?.name?.toString() ?? "");
        }
        if (queryError) {
            setError(queryError.message);
        }
    }, [userGroups, queryError, currentGroup]);

    useEffect(() => {
        setUsers(localLeaderboard as LeaderboardUser[]);
        if (leaderboardError) {
            setError(leaderboardError.message);
        }
    }, [localLeaderboard, leaderboardError]);
    


    return(
        <>
            <Header />
            <div className='min-h-screen flex items-center justify-center bg-[#FFF1D4] py-28'>
                <div className='w-1/3'>
                    <Card className="w-full">
                    <CardHeader>
                        <CardTitle className='text-yellow-600 text-5xl'>{current}</CardTitle>
                        <CardTitle className='text-yellow-600 text-3xl font-light'>Leaderboard</CardTitle>
                    </CardHeader>

                    {isLoadingLeaderboard ? (
                        <p>Loading...</p>
                    ) : (
                        <LeaderboardContainer users={users} />
                    )}


                    </Card>
                    
                    <div className='absolute top-1/2 left-1/20 bg-[#F6CF81] p-6 rounded-3xl w-1/5'>
                        <p className='font-bold text-amber-900 text-2xl text-center mb-4'>Checkout Your <br></br> Other Groups</p>

                        {groupsLoading ? (
                            <p>Loading</p>
                        ) : (
                            usergroups.map((value, key) => (
                                <Link href={`/leaderboard/group?groupId=${value.id}&groupName=${value.name}`} key={key}>
                                    <div className='flex flex-row justify-between w-full bg-white rounded-full p-3 px-6 mb-2'>
                                        <span className='font-bold text-xl text-yellow-600'>{key+1}</span>
                                        <span className='text-xl text-gray-600'>{value.name}</span>
                                    </div>
                                </Link>
                            ))
                        )}

                    </div>
                    
                    <div className='flex justify-center text-yellow-600 mt-6'>
                        <p className='text-3xl font-light'>Checkout out <span className='font-bold cursor-pointer font-bold'>
                            <Link href='/leaderboard'>Global Leaderboard</Link>
                        </span></p>
                    </div>
                </div>
            </div>
        </>
    )
}