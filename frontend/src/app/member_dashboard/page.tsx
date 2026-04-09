import AuthGuard from "../components/AuthGuard"

export default function Member_dashboard() {
    return (
        <AuthGuard>
            <h1 className="text-[#202022]">This is the Member Dashboard Page</h1>
        </AuthGuard>
    )
}