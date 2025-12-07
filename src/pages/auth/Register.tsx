import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Heart, Eye, EyeOff, ArrowLeft, Building2, Users, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type AccountType = "company" | "individual" | null;

export default function Register() {
  const [searchParams] = useSearchParams();
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "company" || type === "individual") {
      setAccountType(type);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate registration - replace with actual auth
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created!",
        description: "Welcome to CareConnect. Let's get started!",
      });
      navigate("/dashboard");
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!accountType) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-subtle px-4 py-12">
        <div className="w-full max-w-2xl animate-fade-up">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shadow-lg group-hover:shadow-glow transition-shadow duration-300">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
            </Link>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Create Your Account
            </h1>
            <p className="text-muted-foreground">
              Choose the type of account that best fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card
              variant="feature"
              className={cn(
                "cursor-pointer transition-all duration-300",
                "hover:border-primary hover:shadow-glow"
              )}
              onClick={() => setAccountType("company")}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Company Account</CardTitle>
                <CardDescription className="text-base">
                  For caregiving agencies and organizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {["Manage multiple caregivers", "Team coordination", "Admin dashboard", "Billing tools"].map(
                    (item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card
              variant="feature"
              className={cn(
                "cursor-pointer transition-all duration-300",
                "hover:border-secondary hover:shadow-warm"
              )}
              onClick={() => setAccountType("individual")}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary-light flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle>Individual Account</CardTitle>
                <CardDescription className="text-base">
                  For independent caregivers and families
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {["Personal dashboard", "Patient management", "Medication tracking", "Community access"].map(
                    (item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-secondary" />
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-subtle px-4 py-12">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shadow-lg group-hover:shadow-glow transition-shadow duration-300">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            {accountType === "company" ? "Company Registration" : "Individual Registration"}
          </h1>
          <p className="text-muted-foreground">
            Create your {accountType === "company" ? "company" : "personal"} account
          </p>
        </div>

        <Card variant="elevated" className="border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {accountType === "company" ? "Company Details" : "Your Details"}
              </CardTitle>
              <button
                onClick={() => setAccountType(null)}
                className="text-sm text-primary hover:underline"
              >
                Change type
              </button>
            </div>
            <CardDescription>Fill in your information to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {accountType === "company" && (
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Your Company Inc."
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">
                  {accountType === "company" ? "Administrator Name" : "Full Name"}
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant={accountType === "company" ? "hero" : "warm"}
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
