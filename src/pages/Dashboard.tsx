import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cpu, Boxes, DoorOpen, MoveVertical, Lock, Cuboid, X, LogOut } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { toast } from "@/hooks/use-toast";
const features = [{
  id: "amr",
  name: "AMR",
  icon: Cpu,
  description: "Autonomous Mobile Robots",
  gradient: "from-primary to-secondary"
}, {
  id: "scara",
  name: "SCARA",
  icon: Boxes,
  description: "Selective Compliance Robot Arm",
  gradient: "from-secondary to-accent"
}, {
  id: "bay-door",
  name: "BAY DOOR",
  icon: DoorOpen,
  description: "Automated Bay Door Control",
  gradient: "from-accent to-primary"
}, {
  id: "scissor-lift",
  name: "SCISSOR LIFT",
  icon: MoveVertical,
  description: "Vertical Material Handling",
  gradient: "from-primary to-accent"
}, {
  id: "locker",
  name: "LOCKER",
  icon: Lock,
  description: "Smart Storage Solutions",
  gradient: "from-secondary to-primary"
}, {
  id: "conveyor",
  name: "CONVEYOR",
  icon: Cuboid,
  description: "Belt Conveyor System",
  gradient: "from-accent to-secondary"
}];
const mockTrays = [{
  id: "TID-1000100",
  weight: "25 kg",
  division: "A1",
  height: "120 cm"
}, {
  id: "TID-1000101",
  weight: "30 kg",
  division: "A2",
  height: "150 cm"
}, {
  id: "TID-1000102",
  weight: "22 kg",
  division: "B1",
  height: "110 cm"
}, {
  id: "TID-1000103",
  weight: "28 kg",
  division: "B2",
  height: "135 cm"
}, {
  id: "TID-1000104",
  weight: "26 kg",
  division: "C1",
  height: "125 cm"
}, {
  id: "TID-1000105",
  weight: "32 kg",
  division: "C2",
  height: "140 cm"
}];
const Dashboard = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<string>("");
  const [selectedTray, setSelectedTray] = useState<string>("");
  const handleSystemClick = (systemName: string) => {
    setSelectedSystem(systemName);
    setSelectedTray("");
    setDrawerOpen(true);
  };
  const handleRequestTray = () => {
    toast({
      title: "Tray Request Sent",
      description: `Request for ${selectedTray} via ${selectedSystem} has been submitted.`
    });
    setDrawerOpen(false);
    setSelectedTray("");
  };
  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully."
    });
    navigate("/login");
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <Button onClick={handleLogout} variant="outline" size="icon" className="rounded-full shadow-lg">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="text-center mb-4 animate-fade-in">
          <h1 className="md:text-4xl font-bold text-foreground mb-1 text-lg">Leapmile Systems</h1>
          <p className="text-sm text-muted-foreground">Select a system to control</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-16">
          {features.map((feature, index) => <div key={feature.id} className="animate-scale-in" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              <FeatureCard {...feature} onClick={() => handleSystemClick(feature.name)} />
            </div>)}
        </div>

        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent className="h-[65vh]">
            <DrawerHeader className="flex items-center justify-between border-b pb-4">
              <DrawerTitle className="text-xl font-bold">{selectedSystem}</DrawerTitle>
              <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)} className="h-8 w-8">
                <X className="h-5 w-5" />
              </Button>
            </DrawerHeader>
            
            <div className="flex flex-col h-full p-4 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {mockTrays.map(tray => <button key={tray.id} onClick={() => setSelectedTray(tray.id)} className={`w-full p-4 rounded-lg border-2 text-left transition-all ${selectedTray === tray.id ? "border-accent bg-accent/10" : "border-border bg-card hover:border-accent/50"}`}>
                    <div className="font-bold text-foreground mb-2">{tray.id}</div>
                    <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div>
                        <div className="text-xs opacity-70">Weight</div>
                        <div className="font-medium text-foreground">{tray.weight}</div>
                      </div>
                      <div>
                        <div className="text-xs opacity-70">Division</div>
                        <div className="font-medium text-foreground">{tray.division}</div>
                      </div>
                      <div>
                        <div className="text-xs opacity-70">Height</div>
                        <div className="font-medium text-foreground">{tray.height}</div>
                      </div>
                    </div>
                  </button>)}
              </div>
              
              <Button onClick={handleRequestTray} disabled={!selectedTray} className="w-full py-6 text-lg font-semibold">
                {selectedTray ? `Request Tray ${selectedTray}` : "Select a Tray"}
              </Button>
            </div>
          </DrawerContent>
        </Drawer>

        <div className="fixed bottom-4 right-4 animate-fade-in" style={{
        animationDelay: "0.6s"
      }}>
          <Button onClick={() => navigate("/stations")} className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 py-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95">
            Stations
          </Button>
        </div>
      </div>
    </div>;
};
export default Dashboard;