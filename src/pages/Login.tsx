import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [baseUrl, setBaseUrl] = useState("ims-event");
  const [phone, setPhone] = useState("1234567890");
  const [password, setPassword] = useState("567890");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phone === "1234567890" && password === "567890") {
      toast({
        title: "Login Successful",
        description: "Welcome to IMS Warehouse Control",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Invalid Credentials",
        description: "Please check your phone number and password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 backdrop-blur-sm mb-4 animate-glow">
            <Bot className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">IMS Robotics</h1>
          <p className="text-muted-foreground">Warehouse Control System</p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-border">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="baseUrl" className="text-foreground">Base URL</Label>
              <Input
                id="baseUrl"
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="bg-background/50 border-border focus:border-accent transition-colors"
                placeholder="ims-event"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-background/50 border-border focus:border-accent transition-colors"
                placeholder="1234567890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-border focus:border-accent transition-colors"
                placeholder="••••••"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Exhibition Demo Mode
        </p>
      </div>
    </div>
  );
};

export default Login;
