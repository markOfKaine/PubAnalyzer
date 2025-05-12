"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { UserSchema } from "@/types/UserSchema";


function SignUpPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [redirecting, setRedirecting] = useState(false);


  // Initialize react-hook-form
  const form = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

    const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);

    // Form submission successful
    console.log("Form data submitted:", data);

    // TODO: TW - Replace with actual API call
    // fetch('/api/signup', {
    // method: 'POST',
    // headers: { 'Content-Type': 'application/json' },
    // body: JSON.stringify(data),
    // })
    // .then((response) => response.json())
    // .then((data) => {
    //     if (data.success) {
    //         console.log("Signup successful:", data);
    //         setSubmitted(true);
    //         setRedirecting(true);
    //     } else {
    //         console.error("Signup error:", data.message);
    //         setError(data.message);
    //     }
    // })
    // .catch((error) => {
    //     console.error("Error during signup:", error);
    //     setError("An error occurred during signup. Please try again.");
    // })
    // .finally(() => {
    //     setIsLoading(false);
    // });

    setSubmitted(true);
    setRedirecting(true);
    };

  // Redirect user after successful signup
    useEffect(() => {
      let redirectTimer;

      if (redirecting && !error) {
        redirectTimer = setTimeout(() => {
          router.push("/articles");
        }, 2000);
      }

      return () => {
        if (redirectTimer) clearTimeout(redirectTimer);
      };
    }, [redirecting, error, router]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (submitted) {
    return (
      <Card
        className={`w-full max-w-md mx-auto mt-16 
        ${error ? "border-destructive" : "border-primary"}`}
      >
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {error ? "Signup Failed" : "Success!"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-accent">
            <AlertDescription
              className={`text-center ${
                error ? "text-destructive" : "text-secondary-foreground"
              }`}
            >
              {error
                ? `${error} Please try again.`
                : "Thank you for signing up! You will be redirected shortly..."}
            </AlertDescription>
          </Alert>
          {error && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setError(null);
                }}
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-16">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Create an Account
        </CardTitle>
        <CardDescription className="text-center">
          Sign up to get started with PubAnalyzer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a secure password"
                        {...field}
                        className="w-full pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Uncomment this section to add terms and conditions checkbox */}
            {/* <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                      id="terms"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="terms" className="text-sm font-medium leading-none cursor-pointer">
                      I agree to the Terms of Service and Privacy Policy
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            /> */}

            <Button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-background bg-primary
              border border-transparent rounded-md shadow-sm 
              hover:bg-primary/80 focus:outline-none focus:ring-ring focus:ring-offset-2"
            >
              Create Account
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center p-4">
        <p className="text-sm text-center text-card-foreground">
          <span>Already have an account?</span>{" "}
          <Link
            href={"/signin"}
            className="font-medium text-primary hover:text-primary/80"
          >
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default SignUpPage;
