'use client'
import {useState, useEffect} from 'react';
import { Card, CardHeader, CardTitle} from '~/components/ui/card';
import Link from 'next/link';
import Header from '../_components/header';

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
        <div className='min-h-screen flex items-center justify-center bg-[#FFF1D4]'>
            <div className='w-1/3'>
                <Card className="w-full">
                <CardHeader>
                    <CardTitle className='text-yellow-600 text-5xl'>Global Leaderboard</CardTitle>
                </CardHeader>
        
                {users.map((value, key) => (
                    <div key={key} className='flex flex-row justify-between w-full bg-white rounded-full px-4 py-4 -mb-2'>
                        <div className='flex flex-row justify-between w-1/4'>
                            <p className='text-yellow-600 text-xl font-bold'>{value.ranking}</p>
                            <p className='ml-auto text-left w-1/2 text-xl text-gray-600'>{value.username}</p>
                        </div>
                        <div className='flex flex-row justify-between'>
                            <p className='text-xl font-bold text-amber-700'>{value.categoryCount} ct.</p>
                            <p className='ml-8 text-xl font-bold text-amber-700'>{value.time}s</p>
                        </div>
                    </div>
                ))}


                </Card>
                
                <div className='flex justify-center text-yellow-600 mt-6'>
                    <p className='text-3xl font-light'>Checkout out <span className='font-bold cursor-pointer font-bold'>
                        <Link href='/friend-leaderboard'>Friend Leaderboard</Link>
                    </span></p>
                </div>
            </div>
        </div>
    )
}