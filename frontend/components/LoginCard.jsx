import Link from "next/link";
import CardBackground from "./CardBackground";

function LoginCard() {
  const handleSubmit = () => {};

  return (
    <div className="flex justify-center min-h-screen pt-16">
      <div className="w-full max-w-md">
        <CardBackground>
          <div className="text-center my-8">
            <h2 className="text-3xl font-extrabold text-card-foreground">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-card-foreground">
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
                  className="text-sm font-medium text-card-foreground"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 mt-1 border border-input bg-card rounded-md shadow-sm focus:outline-none
                  focus:ring focus:ring-primary focus:border-border"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-card-foreground"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 mt-1 border border-input bg-card rounded-md shadow-sm focus:outline-none
                  focus:ring focus:ring-primary focus:border-border"
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
                  className="w-4 h-4 text-card-foreground border-primary rounded focus:ring"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-foreground"
                >
                  Remember me
                </label>
              </div>

              {/* Forgot Password Link */}
              {/* TODO: TW - Replace with proper path once forgot password page created. */}
              <Link
                href={"/"}
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            {/* TODO: TW - Add proper onclick event once implemented. */}
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-background bg-primary
              border border-transparent rounded-md shadow-sm 
              hover:bg-primary/80 focus:outline-none focus:ring-ring focus:ring-offset-2"
            >
              Sign in
            </button>
          </form>

          {/* Sign Up Link */}
          {/* TODO: TW - Replace with proper path once sign up page added. */}
          <p className="mt-8 text-sm text-center text-card-foreground">
            <span>Don't have an account?</span>{" "}
            <Link
              href={"/signup"}
              className="font-medium text-primary hover:text-primary/80"
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
