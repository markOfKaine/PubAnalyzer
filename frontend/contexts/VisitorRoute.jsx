'use client';
import { useUserContext } from "@/contexts/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function VisitorRoute({ children }) {
    const { user, loading } = useUserContext();
    const router = useRouter();

    // Redirect to the articles page if the user is logged in
    useEffect(() => {
        if (!loading && user) {
        router.push("/dashboard");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
        <div className="flex justify-center items-center h-screen">
            <p>Loading...</p>
        </div>
        );
    }

    if (user) {
        return null;
    }

    return children;
}

export default VisitorRoute;