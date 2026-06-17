import {Link, useNavigate, useLocation} from "react-router";
import {usePuterStore} from "~/lib/puter";

const Navbar = () => {
    const { auth } = usePuterStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignOut = async () => {
        await auth.signOut();
        navigate('/auth');
    }

    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">ResumeX</p>
            </Link>
            <div className="flex items-center gap-4">
                {location.pathname !== '/upload' && (
                    <Link to="/upload" className="primary-button w-fit">
                        Upload Resume
                    </Link>
                )}
                {auth.isAuthenticated && (
                    <button onClick={handleSignOut} className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">
                        Logout
                    </button>
                )}
            </div>
        </nav>
    )
}
export default Navbar