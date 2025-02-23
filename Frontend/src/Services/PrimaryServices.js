class PrimaryServices {

    // optimized codes
    async SignIn(loginCredentials) {
        // endpoint details
        const endpoint_URL = import.meta.env.VITE_API_URL;

        try {
            // validators
            if (!loginCredentials || typeof loginCredentials !== 'object') throw new Error("Invalid login credentials");
            /**
             * Email addresses can include numbers, but they typically cannot start with a number. According to RFC 5322 and other standards, the local-part of an email address can contain numbers, but starting an email address with a number is generally not allowed by many email services and systems due to technical and validation rules.
             */
            if (loginCredentials?.email && !loginCredentials?.email.includes('@gmail.com')) throw new Error("Invalid email!");
            if (loginCredentials?.phoneNo && loginCredentials?.phoneNo.length < 10) throw new Error("Invalid phoneNo!");
            if (!loginCredentials?.password || typeof loginCredentials?.password !== 'string') throw new Error("Invalid password or type of password is not a string!");

            const response = await fetch(`${endpoint_URL}/account/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ loginCredentials })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message);
            }

            const data = await response.json();

            return { data: { message: data?.message, token: data?.token }, success: true };
        } catch (error) {
            if (error instanceof Error) {
                return { data: { message: error.message ?? "Sign in failed! Added from the frontend!" }, success: false }
            }
        }
    }

    // optimized codes
    async LogOut(token) {
        const endpoint_URL = import.meta.env.VITE_API_URL;

        try {
            // validator
            if (!token || typeof token !== 'string') throw new Error("Invalid token or type of token is not a string!");

            const response = await fetch(`${endpoint_URL}/account/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}` // needs token for logout
                },
                credentials: 'include',
                // body: empty       // remove the body if the body is empty
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message);
            }

            const data = await response.json();
            return { data: { message: data?.message }, success: true };
        } catch (error) {
            if (error instanceof Error) {
                return { data: { message: error?.message ?? 'Logout failed! Added from the frontend!' }, success: false }
            }
        }
    }

    async SingUp() {
        try {

        } catch (error) {

        }
    }
}

const primaryServices = new PrimaryServices();
export default primaryServices;
