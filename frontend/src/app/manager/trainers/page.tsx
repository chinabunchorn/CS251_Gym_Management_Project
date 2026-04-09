import AuthGuard from "../../components/AuthGuard"

export default function Manager_trainers() {
    return (
        <AuthGuard>
            <h1 className="text-[#202022]">This is the Manager trainers page</h1>
        </AuthGuard>
    )
}