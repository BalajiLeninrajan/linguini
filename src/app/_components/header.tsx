'use client'
import Image from 'next/image';

export default function Header(){

    return(
        <div className='flex justify-center p-4 absolute z-5 w-full bg-[#F6CF81]'>
            <Image src='/linguini.svg' alt='Linguini' width={250} height={250}/>
            <Image src='/pasta.svg' alt='Linguini' width={250} height={200} className='absolute left-0 top-24 hidden sm:block'/>
        </div>
    )
}