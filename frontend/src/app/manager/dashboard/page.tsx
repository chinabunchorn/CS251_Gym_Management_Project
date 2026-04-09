import AuthGuard from "../../components/AuthGuard"

export default function Manager_dashboard() {
    return (
        <AuthGuard>
            <h1 className="text-[#202022]">This is the Manager Dashboard page</h1>
        </AuthGuard>
    )
}