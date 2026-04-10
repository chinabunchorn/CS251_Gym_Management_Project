import AuthGuard from "../../components/AuthGuard"
import Navbar from "../../components/manager_navbar"

export default function Manager_dashboard() {
    return (
        <AuthGuard>
            <Navbar />
            <h1 className="text-[#202022]">This is the Manager Dashboard page</h1>
        </AuthGuard>
    )
}