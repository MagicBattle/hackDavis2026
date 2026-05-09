import { ScanHeart } from "lucide-react"

function Header () {
    return(
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-indigo-900">Flipit</h1>
            <ScanHeart size={30} color="indigo"/>
        </header>
    );
}

export default Header;