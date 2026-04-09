import AuthGuard from "../../components/AuthGuard"

export default function Manager_lockers() {
    return (
        <AuthGuard>
            <h1 className="text-[#202022]">This is the Manager lockers page</h1>
        </AuthGuard>
    )
}