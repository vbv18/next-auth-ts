import LoginForm from "@/components/login-form/page";

export default function LoginPage() {

    return (
        <main
            className="min-h-screen flex items-center justify-center px-4"
        >
            <div
                className="w-full max-w-md border rounded-xl p-8 shadow-sm"
            >
                <div
                    className="mb-8 text-center"
                >
                    <h1
                        className="text-3xl font-bold"
                    >
                        Login
                    </h1>

                    <p
                        className="mt-2 text-sm text-gray-500"
                    >
                        Sign in to continue
                    </p>
                </div>

                <LoginForm />
            </div>
        </main>
    );
}