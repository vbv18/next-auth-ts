import CredentialProvider from "next-auth/providers/credentials";

export let authOptions = {
    providers: [
        CredentialProvider({
            name: "credentials"
        }),
    ]
};