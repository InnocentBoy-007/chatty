class PrimaryServices {
    async SignIn(loginCredentials) {
        if (!loginCredentials || typeof loginCredentials !== 'object') throw new Error("Invalid login credentials");

        // validation for email or phone number
        if (!loginCredentials?.email && loginCredentials?.phoneNo) {

            // check if phone number is valid
            if (loginCredentials?.phoneNo || typeof loginCredentials?.phoneNo !== 'string') throw new Error("Invalid phone number or is not a string!");

            // check if email is valid
            else if (loginCredentials?.email || typeof loginCredentials?.email !== 'string') throw new Error("Invalid email or type of email is not a string!");
        }

        // validation for password
        if (!loginCredentials?.password || typeof loginCredentials?.password !== 'string') throw new Error("Invalid password or type of password is not a string!");

        // endpoint details
        const endpoint_URL = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${endpoint_URL}/account/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // add authorization here
                },
                body: JSON.stringify({ loginCredentials }),
            });

            const data = await response.json();
            const { message, token } = data;

            return { data: { message, token } };
        } catch (error) {
            console.error(error);
            return { message: "An unexpected error ocured while trying to login!" };
        }
    }

    async LogOut(logoutCredentials, token) {
        const endpoint_URL = import.meta.env.VITE_API_URL;
        try {
            const response = await fetch(`${endpoint_URL}/account/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}` // needs token for logout
                },
                body: JSON.stringify({ logoutCredentials })
            });

            const data = response.json();
            const { message } = data;

            return { data: { message } };
        } catch (error) {
            console.error(error);
            return { message: "An unexpected error ocured while trying to logout!" };
        }
    }

    async SingUp() {
        try {

        } catch (error) {

        }
    }
}

export default PrimaryServices;