'use client'
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { Users, Home, BarChart3, Heart } from 'lucide-react';

export default function Header(){
    return(
        <div className='flex justify-between items-center p-4 absolute z-5 w-full bg-[#F6CF81]'>
            <div className='flex-1'></div>
            
            <div className='flex items-center'>
                <Image src='/linguini.svg' alt='Linguini' width={250} height={250}/>
                <Image src='/pasta.svg' alt='Linguini' width={250} height={200} className='absolute left-0 top-24 hidden sm:block'/>
            </div>
            
            <div className='flex gap-3 flex-1 justify-end'>
                <Link href="/groups">
                    <Button variant="nav" size="nav">
                        <Users />
                    </Button>
                </Link>
                <Link href="/game">
                    <Button variant="nav" size="nav">
                        <Home />
                    </Button>
                </Link>
                <Link href="/leaderboard">
                    <Button variant="nav" size="nav">
                        <BarChart3 />
                    </Button>
                </Link>
                <Link href="/about">
                    <Button variant="nav" size="nav">
                        <Heart />
                    </Button>
                </Link>
            </div>
        </div>
    )
}