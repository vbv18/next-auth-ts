import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {

    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold">
                Dashboard
            </h1>

            <pre className="mt-4">
                {JSON.stringify(
                    session,
                    null,
                    2
                )}
            </pre>
        </div>
    );
}