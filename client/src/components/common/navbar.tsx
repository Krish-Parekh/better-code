import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="border-b-2 border-dashed border-gray-200 flex justify-between items-center">
            <Link className="p-4" href="/">
                <h1 className="text-3xl font-bold">BetterCode</h1>
            </Link>
            <div className="flex h-full">
                <div className="h-full cursor-pointer">
                    <Link href="/login" className="flex p-4 border-s-2 border-dashed border-gray-200 h-full items-center justify-center gap-4">
                        <h2 className="text-xl font-bold text-center">Login</h2>
                    </Link>
                </div>
                <div className="h-full cursor-pointer">
                    <Link href="/signup" className="flex p-4 border-s-2 border-dashed border-gray-200 h-full items-center justify-center gap-4">
                        <h2 className="text-xl font-bold text-center">Signup</h2>
                    </Link>
                </div>
            </div>
        </nav>
    )
}