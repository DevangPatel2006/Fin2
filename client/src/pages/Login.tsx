import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    // ✅ User already logged in, redirect to dashboard
    window.location.href = "/dashboard";
  }
}, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // ✅ Save token for 3-day session
      localStorage.setItem("token", res.data.token);

      toast({
        title: "Welcome back!",
        description: "Login successful ✅",
      });

      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Login failed ❌",
        description:
          err.response?.data?.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleLogin}
        className="glass-card p-6 sm:p-8 lg:p-10 rounded-2xl space-y-6 w-full max-w-md mx-auto shadow-lg"
      >
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          <span className="text-gradient-indigo"><span className="text-gradient-indigo">Login</span></span>
        </h1>
        <p className="text-center text-sm text-muted-foreground mb-4 sm:mb-6">
          Welcome back! Please enter your details to continue.
        </p>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="h-11 sm:h-12"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="h-11 sm:h-12"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="luxury"
          className="w-full h-11 sm:h-12 text-base font-semibold"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {/* Signup Redirect */}
        <p className="text-center text-sm text-muted-foreground pt-2">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-accent font-semibold cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
