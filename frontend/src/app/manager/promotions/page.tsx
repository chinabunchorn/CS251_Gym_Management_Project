import AuthGuard from "../../components/AuthGuard"

export default function Manager_promotions() {
    return (
        <AuthGuard>
            <h1 className="text-[#202022]">This is the Manager promotions page</h1>
        </AuthGuard>
    )
}