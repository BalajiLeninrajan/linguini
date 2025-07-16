'use client'
import {useState} from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Input } from "~/components/ui/input"
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { api } from '~/trpc/react';
import { toast } from 'sonner';


export default function LoginPage() {
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    const currentUser = api.auth.currentUser.useQuery(undefined, {
        refetchOnWindowFocus: false,
    });

    const login = api.auth.login.useMutation({
        onSuccess: async (data) => {
            localStorage.setItem("token", data.token);
            await currentUser.refetch();
        },
        onError: (error) => {
            setError(error.message);
        },
    });

    const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
        //call to the API to login the user
        e.preventDefault();
        try{
            login.mutate({
                identifier: usernameOrEmail,
                password: password,
            })
        }catch(e){
            toast("An error has occured, please try again!");
            console.log(e);
        }
    }

    return(
        <div className='min-h-screen flex items-center justify-center bg-[#FFF1D4]'>
            <div className='w-1/4'>
                <Card className="w-full">
                <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={loginUser}>
                    <div className="flex flex-col gap-3">
                        <div className="grid gap-1">
                        <Input
                            id="usernameEmail"
                            type="text"
                            placeholder="Username or Email"
                            required
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                        />
                        </div>
                        <div className="grid gap-1">
                        <Input
                            id="password"
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        </div>
                        <Button variant="brownPrimary" type="submit" className="w-full">
                        Log in
                        </Button>
                    </div>
                    </form>
                </CardContent>
                </Card>
                
                <div className='flex justify-center text-yellow-600 mt-6'>
                    <p className='text-2xl font-normal'>New around here? <span className='font-bold cursor-pointer'>
                        <Link href='signup'>Sign up</Link>
                    </span></p>
                </div>
            </div>
        </div>
    )
}