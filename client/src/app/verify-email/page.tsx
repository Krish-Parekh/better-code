"use client";
import { authClient } from '@/lib/auth-client';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function page() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            authClient.verifyEmail({ query: { token } })
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
    }, [token])
    return (
        <div>page</div>
    )
}
