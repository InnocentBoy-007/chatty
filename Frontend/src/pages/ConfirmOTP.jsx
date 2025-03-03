import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie'

export default function ConfirmOTP() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const token = Cookie.get("credentials");
    // Split the token into its three parts
    const [header, payload, signature] = token.split(".");
    // Decode the payload (base64url to JSON)
    const decodedPayload = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));

    const otpID = Cookie.get("otpID");
    const [loading, setLoading] = useState(false);

    const signUpHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:9000/api/account/otp-confirmation/${otpID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ otp, accountCredentials: decodedPayload.userDetails }),
            })
            if (!response.ok) {
                setLoading(false);
                const errorData = await response.json();
                navigate("/signup");
                alert(errorData.message);
            }
            setLoading(false);
            setOtp("");
            const data = await response.json();
            Cookie.set("token", data.token); // set the new token which contains the userID
            navigate("/homepage");
            Cookie.remove("credentials"); // remove the old token
            Cookie.remove("otpID"); // remove the old token
            alert(data.message);
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
                    <form onSubmit={signUpHandler}>
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium text-gray-700"
                                htmlFor="otp"
                            >
                                otp
                            </label>
                            <input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
                        >
                            {loading ? "confirming..." : "confirm"}
                        </button>
                    </form>
                </div>
            </div>
        </>

    )
}
