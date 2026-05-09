import { ScanHeart } from "lucide-react"

function Header () {
    return(
        <header className="flex items-center justify-between px-6 py-4 bg-indigo-300 shadow-md">
            <h1 className="text-2xl font-bold text-white">Flipit</h1>
            <ScanHeart size={30} color="white"/>
        </header>
    );
}

export default Header;