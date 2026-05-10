import { ScanHeart } from "lucide-react"
import { Link } from "react-router-dom"

function Header () {
    return(
        <header className="flex items-center justify-between px-6 py-4 bg-indigo-300 shadow-md">
            <Link to="/" className="text-2xl font-bold text-white hover:opacity-80">Flipit</Link>
            <Link to="/" className="text-sm text-white font-medium hover:opacity-80">Home</Link>
            <ScanHeart size={30} color="white"/>
        </header>
    );
}

export default Header;