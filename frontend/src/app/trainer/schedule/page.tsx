import AuthGuard from "../../components/AuthGuard";
import Navbar from "../../components/trainer_navbar";

export default function Trainer_schedule() {
    return (
        <AuthGuard>
            <Navbar />
            <div className="text-[#202022]">This is the Trainer schedule page</div>
        </AuthGuard>
    )
}

