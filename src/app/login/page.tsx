'use client'
import {useState, useEffect} from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardFooter, CardContent } from '~/components/ui/card';
import { Input } from "~/components/ui/input"
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import SignupPage from '../signup/page';
import Link from 'next/link';

export default function LoginPage() {
    return(
        <div className='min-h-screen flex items-center justify-center bg-[#FFF1D4]'>
            <div className='w-1/4'>
                <Card className="w-full">
                <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                </CardHeader>
                <CardContent>
                    <form>
                    <div className="flex flex-col gap-3">
                        <div className="grid gap-1">
                        <Input
                            id="usernameEmail"
                            type="text"
                            placeholder="Username or Email"
                            required
                        />
                        </div>
                        <div className="grid gap-1">
                        <Input
                            id="password"
                            type="password"
                            placeholder="Password"
                            required
                        />
                        </div>
                    </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button variant="brownPrimary" type="submit" className="w-full">
                    Log in
                    </Button>
                </CardFooter>
                </Card>
                
                <div className='flex justify-center text-yellow-600 mt-6'>
                    <p className='text-2xl font-normal'>New around here? <span className='font-bold cursor-pointer'>
                        <Link href='/signup'>Sign up</Link>
                    </span></p>
                </div>
            </div>
        </div>
    )
}