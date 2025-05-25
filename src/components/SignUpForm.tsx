
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type UserType = "donor" | "recipient";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<UserType>("donor");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Set the userType from navigation state if provided
  useEffect(() => {
    const state = location.state as { userType?: UserType };
    if (state?.userType && (state.userType === "donor" || state.userType === "recipient")) {
      setUserType(state.userType);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            user_type: userType,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Your account has been created!",
      });
      
      // Navigate to home page
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Create an account</h2>
        <p className="text-sm text-gray-500 mt-2">
          Join our community to donate or receive food
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>I am a:</Label>
          <div className="grid grid-cols-2 gap-4 mt-1">
            <Button
              type="button"
              variant={userType === "donor" ? "default" : "outline"}
              className={userType === "donor" ? "bg-green-500" : ""}
              onClick={() => setUserType("donor")}
            >
              Food Donor
            </Button>
            <Button
              type="button"
              variant={userType === "recipient" ? "default" : "outline"}
              className={userType === "recipient" ? "bg-orange-500" : ""}
              onClick={() => setUserType("recipient")}
            >
              Food Recipient
            </Button>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
      </form>
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/sign-in")}
            className="text-green-600 hover:text-green-500 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
