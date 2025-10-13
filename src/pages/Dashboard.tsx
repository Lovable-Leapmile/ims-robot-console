import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cpu, Boxes, DoorOpen, MoveVertical, Lock, Cuboid, X, LogOut, Loader2 } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Tray {
  id: number;
  tray_id: string;
  tray_status: string;
  tray_height: number;
  tray_weight: number;
  tray_divider: number;
}
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
const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, token } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<string>("");
  const [selectedTray, setSelectedTray] = useState<string>("");
  const [trays, setTrays] = useState<Tray[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTrays = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        'https://robotmanagerv1test.qikpod.com/robotmanager/trays?tray_status=active&order_by_field=updated_at&order_by_type=DESC',
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const data = await response.json();
      if (data.status === 'success') {
        setTrays(data.records);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch trays",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSystemClick = (systemName: string) => {
    setSelectedSystem(systemName);
    setSelectedTray("");
    setDrawerOpen(true);
    
    if (systemName === "SCARA") {
      // Show dummy items for SCARA
      setTrays([
        { id: 1, tray_id: "Item001", tray_status: "available", tray_height: 50, tray_weight: 2, tray_divider: 1 },
        { id: 2, tray_id: "Item002", tray_status: "available", tray_height: 75, tray_weight: 3, tray_divider: 1 },
        { id: 3, tray_id: "Item003", tray_status: "available", tray_height: 60, tray_weight: 2.5, tray_divider: 1 },
      ]);
    } else {
      fetchTrays();
    }
  };
  const handleRequestTray = async () => {
    if (!token || !selectedTray) return;

    if (selectedSystem === "SCARA") {
      setLoading(true);
      try {
        const response = await fetch(
          `https://robotmanagerv1test.qikpod.com/robotmanager/retrieve_tray?tray_id=Tray2&required_tags=station&required_tags=scara`,
          {
            method: 'POST',
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        const data = await response.json();
        if (data.status === 'success') {
          toast({
            title: "Item Retrieved",
            description: `Item ${selectedTray} retrieved successfully via SCARA.`
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to retrieve item",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to connect to server",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    } else {
      toast({
        title: "Tray Request Sent",
        description: `Request for ${selectedTray} via ${selectedSystem} has been submitted.`
      });
    }
    
    setDrawerOpen(false);
    setSelectedTray("");
  };
  const handleLogout = () => {
    logout();
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
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                  </div>
                ) : trays.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No trays available</p>
                  </div>
                ) : (
                  trays.map(tray => (
                    <button 
                      key={tray.id} 
                      onClick={() => setSelectedTray(tray.tray_id)} 
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedTray === tray.tray_id 
                          ? "border-accent bg-accent/10" 
                          : "border-border bg-card hover:border-accent/50"
                      }`}
                    >
                      <div className="font-bold text-foreground mb-2">
                        {selectedSystem === "SCARA" ? `Item: ${tray.tray_id}` : tray.tray_id}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                        <div>
                          <div className="text-xs opacity-70">Weight</div>
                          <div className="font-medium text-foreground">{tray.tray_weight} kg</div>
                        </div>
                        <div>
                          <div className="text-xs opacity-70">Height</div>
                          <div className="font-medium text-foreground">{tray.tray_height} cm</div>
                        </div>
                        <div>
                          <div className="text-xs opacity-70">Status</div>
                          <div className="font-medium text-foreground">{tray.tray_status}</div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
              
              <Button 
                onClick={handleRequestTray} 
                disabled={!selectedTray || loading} 
                className="w-full py-6 text-lg font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : selectedTray ? (
                  selectedSystem === "SCARA" ? `Retrieve Item ${selectedTray}` : `Request Tray ${selectedTray}`
                ) : (
                  selectedSystem === "SCARA" ? "Select an Item" : "Select a Tray"
                )}
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