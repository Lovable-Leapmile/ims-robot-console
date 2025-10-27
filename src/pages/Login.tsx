import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
const Login = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    login,
    isAuthenticated
  } = useAuth();
  const [phone, setPhone] = useState("1234567890");
  const [password, setPassword] = useState("567890");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Static validation
    if (phone === "1234567890" && password === "567890") {
      const staticToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ";
      login(staticToken, "Admin User", 1);
      toast({
        title: "Login Successful",
        description: "Welcome Admin User"
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Invalid Credentials",
        description: "Please check your phone number and password",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="https://leapmile-website.blr1.cdn.digitaloceanspaces.com/Header&footer/litepurple.png" alt="IMS Robotics Logo" className="h-12 w-auto object-contain" />
          </div>
          <h1 className="text-foreground mb-2 font-bold text-xl">IMS Event 2025</h1>
          <p className="text-muted-foreground">Lepamile's Robotic Systems</p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-border">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
              <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="bg-background/50 border-border focus:border-accent transition-colors" placeholder="1234567890" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-background/50 border-border focus:border-accent transition-colors" placeholder="••••••" required />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
              <LogIn className="w-5 h-5 mr-2" />
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Exhibition Demo Mode
        </p>
      </div>
    </div>;
};
export default Login;