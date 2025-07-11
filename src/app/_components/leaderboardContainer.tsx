'use client'

interface User{
    ranking: number,
    username: string,
    categoryCount: number,
    time: number
}

interface UserProps{
    users: User[]
}

export default function LeaderboardContainer({users}: UserProps){

    return(
        <>
        {users.map((value:User, key:number) => (
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
        </>
    )
}