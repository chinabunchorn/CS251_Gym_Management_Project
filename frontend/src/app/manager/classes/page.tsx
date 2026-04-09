import AuthGuard from "../../components/AuthGuard"

export default function Manager_classes() {
    return (
        <AuthGuard>
            <h1 className="text-[#202022]">This is the Manager classes page</h1>
        </AuthGuard>
    )
}