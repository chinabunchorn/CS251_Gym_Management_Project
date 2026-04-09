import AuthGuard from "../../components/AuthGuard"

export default function Manager_members() {
    return (
        <AuthGuard>
            <h1 className="text-[#202022]">This is the Manager members page</h1>
        </AuthGuard>
    )
}