import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    // ✅ User already logged in, redirect to dashboard
    window.location.href = "/dashboard";
  }
}, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);

      // ✅ Save token for 3-day session
      localStorage.setItem("token", res.data.token);

      toast({
        title: "Account created successfully 🎉",
        description: "Welcome to Finlanza!",
      });

      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Signup failed ❌",
        description:
          err.response?.data?.message || "An error occurred during signup.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 sm:p-0">
      <form
        onSubmit={handleSubmit}
        className="glass-card p-8 sm:p-10 rounded-2xl space-y-6 w-full max-w-md mx-auto"
      >
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-foreground">
          Create <span className="text-gradient-indigo">Account</span>
        </h1>
        <p className="text-center text-sm text-muted-foreground">
          Sign up to start managing your finances
        </p>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="luxury"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>

        {/* Login Redirect */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-accent cursor-pointer font-semibold hover:underline"
          >
            Log in
          </span>
        </p>
      </form>
    </div>
  );
}
