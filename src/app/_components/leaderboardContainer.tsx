'use client'
import type { Timestamp } from "next/dist/server/lib/cache-handlers/types";
import type { LeaderboardUser } from "~/server/db"
import type { TimeValue } from "~/types";

interface UserProps{
    users: LeaderboardUser[]
}

export default function LeaderboardContainer({users}: UserProps){

    const formatTime = (time: TimeValue) => {
        if (typeof time === 'number') {
            return time;
        }
        if (typeof time === 'object' && time !== null) {
            console.log(time)
            return time.minutes;
        }
        return time;
    };

    return(
        <>
        {users.map((value:LeaderboardUser, key:number) => (
            <div key={key} className='flex flex-row justify-between w-full bg-white rounded-full px-4 py-4 -mb-2'>
                <div className='flex flex-row justify-between w-1/4'>
                    <p className='text-yellow-600 text-xl font-bold'>{key+1}</p>
                    <p className='ml-auto text-left w-1/2 text-xl text-gray-600'>{value.username}</p>
                </div>
                <div className='flex flex-row justify-between pr-4'>
                    <p className='text-xl font-bold text-amber-700'>{value.category_count} ct.</p>
                    <p className='ml-8 text-xl font-bold text-amber-700 w-5'>{formatTime(value.time)}s</p>
                </div>
            </div>
        ))}
        </>
    )
}