import Link from "next/link";
import CardBackground from "./CardBackground";

function LoginCard() {
  const handleSubmit = () => {};

  return (
    <div className="flex justify-center min-h-screen pt-16">
      <div className="w-full max-w-md">
        <CardBackground>
          <div className="text-center my-8">
            <h2 className="text-3xl font-extrabold text-tertiary-dark">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-tertiary-light">
              Sign in to your account
            </p>
          </div>
          {/* Login Form */}
          <form className="space-y-6">
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-tertiary"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none
                  border-primary-border focus:ring-primary-light focus:border-primary-light"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-tertiary"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none
                  border-primary-border focus:ring-primary-light focus:border-primary-light"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Remember Me - Checkbox */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="w-4 h-4 text-primary border-primary-border rounded focus:ring-primary-light"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-tertiary-dark"
                >
                  Remember me
                </label>
              </div>

              {/* Forgot Password Link */}
              <Link
                href={"#"}
                className="text-sm font-medium text-primary hover:text-primary-light"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-secondary bg-primary
              border border-transparent rounded-md shadow-sm 
              hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
            >
              Sign in
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-sm text-center text-tertiary-light">
            <span>Don't have an account?</span>{" "}
            <Link
              href={"#"}
              className="font-medium text-primary hover:text-primary-light"
            >
              Sign up
            </Link>
          </p>
        </CardBackground>
      </div>
    </div>
  );
}

export default LoginCard;
