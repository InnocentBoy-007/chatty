class PrimaryServices {
    async SignIn(loginCredentials) {
        // endpoint details
        const endpoint_URL = import.meta.env.VITE_API_URL;

        try {
            // validators
            if (!loginCredentials || typeof loginCredentials !== 'object') throw new Error("Invalid login credentials");
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
            return { data: { message: response?.message }, success: true }
        } catch (error) {
            if (error instanceof Error) {
                return { data: { message: error?.message ?? "Login fail! Added from the frontend" }, success: false }
            }
            return { data: { message: "An unexpected error occured while trying to login!" }, success: false };
        }
    }

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
                // body: JSON.stringify() // remove the body if the body is empty
            });

            const data = await response.json();

            if (response.ok) {
                return { data, success: true }
            } else {
                throw new Error(data?.message || 'Failed to log out!');
            }
        } catch (error) {
            if (error instanceof Error) {
                return { data: { message: error.message } }
            }
            return { data: { message: "An unexpected error ocured while trying to logout!" } };
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
