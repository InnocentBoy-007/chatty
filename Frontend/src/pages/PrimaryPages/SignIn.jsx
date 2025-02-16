import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import cookie from 'js-cookie'
import PrimaryServices from '../../Services/PrimaryServices';

export default function SignIn() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [password, setPassword] = useState("");

    /**
     * Function to check if the token is already inside the cookie or not
     * If the token is already in the cookie, then navigate the user to a homepage
     */
    useEffect(() => {
        const token = cookie.get("token");
        if (token) {
            navigate("/homepage");
        }
    })

    const signInHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const primaryService = new PrimaryServices();

        const response = await primaryService.SignIn({email, phoneNo, password});
        if(response) {
            cookie.set("token", response?.data?.token);
            navigate("/homepage");
            console.log(response?.data?.message);
            setLoading(false);
        } else {
            setLoading(false);
            console.log(response?.message);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-sm">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    Sign In
                </h2>
                <form onSubmit={signInHandler}>
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="emailorphone">
                            Email or Phone
                        </label>
                        <input
                            type="text"
                            id="emailorphone"
                            value={email || phoneNo}
                            onChange={(e) => {
                                if (e.target.value.includes("@")) {
                                    setEmail(e.target.value);
                                    setPhoneNo("");
                                } else {
                                    setPhoneNo(e.target.value);
                                    setEmail("");
                                }
                            }}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div className="flex justify-between items-center mb-5">
                        <p className="text-sm text-blue-600 cursor-pointer hover:underline" onClick={() => setForgotPasswordFlag(true)}>
                            Forgot password?
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    )
};
