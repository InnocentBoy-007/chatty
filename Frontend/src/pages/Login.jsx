import React from "react";

export default function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div>
          <div>
            <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
            <form>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="emailorusername"
                >
                  Email or Phone
                </label>
                <input
                  type="text"
                  id="emailorphone"
                  //   value={email || phoneNo}
                  onChange={(e) => {
                    if (e.target.value.includes("@")) {
                      setEmail(e.target.value);
                      setPhoneNo("");
                    } else {
                      setPhoneNo(e.target.value);
                      setEmail("");
                    }
                  }}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  //   value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <p className="italic cursor-pointer inline-block">
                Forgot password
              </p>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md mt-2 hover:bg-blue-600 transition duration-200"
              >
                Login
                {/* {loading ? "signing in..." : "sign in"} */}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
