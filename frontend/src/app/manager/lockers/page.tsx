import AuthGuard from "../../components/AuthGuard"
import Navbar from "../../components/manager_navbar"

export default function Manager_lockers() {
    return (
        <AuthGuard>
            <Navbar />
            <h1 className="text-[#202022]">This is the Manager lockers page</h1>
        </AuthGuard>
    )
}