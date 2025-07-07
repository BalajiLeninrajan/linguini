'use client'
import {useState, useEffect} from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardFooter, CardContent } from '~/components/ui/card';
import { Input } from "~/components/ui/input"
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';

export default function SignupPage() {
    return(
        <div className='min-h-screen flex items-center justify-center'>
            <div className='w-1/4'>
                <Card className="w-full">
                <CardHeader>
                    <CardTitle>Sign up</CardTitle>
                </CardHeader>
                <CardContent>
                    <form>
                    <div className="flex flex-col gap-3">
                        <div className="grid gap-1">
                        <Input
                            id="username"
                            type="text"
                            placeholder="Username"
                            required
                        />
                        </div>
                        <div className="grid gap-1">
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email"
                            required
                        />
                        </div>
                        <div className="grid gap-2">
                        <Input
                            id="password"
                            type="password"
                            placeholder="Password"
                            required
                        />
                        </div>
                        <div className="grid gap-2">
                        <Input
                            id="passwordConfirmation"
                            type="password"
                            placeholder="Confirm Password"
                            required
                        />
                        </div>
                    </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button variant="brownPrimary" type="submit" className="w-full">
                    Create Account
                    </Button>
                </CardFooter>
                </Card>
                
                <div className='flex justify-center text-yellow-500 mt-6'>
                    <p className='text-2xl font-normal'>Not a newbie around here? <span className='font-bold'>Log in</span></p>
                </div>
            </div>
        </div>
    )
}