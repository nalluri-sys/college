import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { adminAuthService } from "@/services/adminAuthService";
import { BookOpen, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  secret: z.string().min(1, "Signup secret is required"),
});

const AdminLogin = () => {
  const [email, setEmail] = useState("admin@vvit.edu");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [secret, setSecret] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; secret?: string }>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  if (adminAuthService.isLoggedIn()) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate input based on mode
    if (mode === "login") {
      const result = loginSchema.safeParse({ email, password });
      if (!result.success) {
        const fieldErrors: { email?: string; password?: string } = {};
        result.error.errors.forEach((err) => {
          if (err.path[0] === "email") fieldErrors.email = err.message;
          if (err.path[0] === "password") fieldErrors.password = err.message;
        });
        setErrors(fieldErrors);
        return;
      }
    } else {
      const result = signupSchema.safeParse({ email, password, secret });
      if (!result.success) {
        const fieldErrors: { email?: string; password?: string; secret?: string } = {};
        result.error.errors.forEach((err) => {
          if (err.path[0] === "email") fieldErrors.email = err.message;
          if (err.path[0] === "password") fieldErrors.password = err.message;
          if (err.path[0] === "secret") fieldErrors.secret = err.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === "login") {
        await adminAuthService.login(email, password);

        toast({
          title: "Login Successful",
          description: "Redirecting to upload page...",
        });
      } else {
        await adminAuthService.signup(email, password, secret);

        toast({
          title: "Signup Successful",
          description: "Admin account created. Redirecting...",
        });
      }

      navigate("/upload");
    } catch (error) {
      toast({
        title: mode === "login" ? "Login Failed" : "Signup Failed",
        description: error instanceof Error ? error.message : "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - VVIT Materials Hub</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-hero-gradient p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-elevated border border-border p-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-foreground">VVIT</span>
                  <span className="text-xs text-muted-foreground">Admin Portal</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {mode === "login" ? "Admin Login" : "Admin Signup"}
                </h1>
                <p className="text-muted-foreground">
                  {mode === "login" ? "Sign in to manage materials" : "Create an admin account (requires secret)"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setErrors({});
                }}
                className="text-sm text-primary hover:underline"
              >
                {mode === "login" ? "Need an account?" : "Have an account?"}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@vvit.net"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="secret">Signup Secret</Label>
                  <Input
                    id="secret"
                    type="password"
                    placeholder="Enter signup secret"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.secret && (
                    <p className="text-sm text-destructive">{errors.secret}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Ask the site owner for the admin signup secret.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (mode === "login" ? "Signing in..." : "Creating account...") : mode === "login" ? "Sign In" : "Sign Up"}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-6">
              Only authorized administrators can access this portal.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
