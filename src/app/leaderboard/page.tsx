'use client'
import {useState} from 'react';
import { Card, CardHeader, CardTitle} from '~/components/ui/card';
import Link from 'next/link';
import Header from '../_components/header';
import LeaderboardContainer from '../_components/leaderboardContainer';

export default function Leaderboard() {
    //hardcoding UI values for testing
    const [users, setUsers] = useState([
            {
                ranking: 1,
                username: "Alex",
                categoryCount: 3,
                time: 53
            },
            {
                ranking: 2,
                username: "Julia",
                categoryCount: 3,
                time: 53
            },
            {
                ranking: 3,
                username: "Balaji",
                categoryCount: 3,
                time: 53
            },
            {
                ranking: 4,
                username: "Nicolas",
                categoryCount: 3,
                time: 53
            },
            {
                ranking: 5,
                username: "George",
                categoryCount: 3,
                time: 53
            }
        ]);

    return(
        <>
            <Header />
            <div className='min-h-screen flex items-center justify-center bg-[#FFF1D4]'>
                <div className='w-1/3'>
                    <Card className="w-full">
                    <CardHeader>
                        <CardTitle className='text-yellow-600 text-5xl'>Global Leaderboard</CardTitle>
                    </CardHeader>

                    <LeaderboardContainer users={users}/>


                    </Card>
                    
                    <div className='flex justify-center text-yellow-600 mt-6'>
                        <p className='text-3xl font-light'>Checkout out <span className='font-bold cursor-pointer font-bold'>
                            <Link href='/group-leaderboard'>Friend Leaderboard</Link>
                        </span></p>
                    </div>
                </div>
            </div>
        </>
    )
}