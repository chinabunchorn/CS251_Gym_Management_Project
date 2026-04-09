import AuthGuard from "../../components/AuthGuard"

export default function Manager_equipments() {
    return (
        <AuthGuard>
            <h1 className="text-[#202022]">This is the Manager equipments page</h1>
        </AuthGuard>
    )
}