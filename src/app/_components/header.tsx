'use client'
import {useState, useEffect, useRef} from 'react';
import Image from 'next/image';

export default function Header(){

    return(
        <div className='flex justify-center p-8 absolute z-5 w-full' style={{ backgroundColor: '#F6CF81' }}>
            <Image src='/linguini.svg' alt='Linguini' width={200} height={200}/>
            <Image src='/pasta.svg' alt='Linguini' width={300} height={200} className='absolute left-0 top-29'/>
        </div>
    )
}