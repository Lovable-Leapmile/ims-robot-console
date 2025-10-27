import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cpu, Boxes, DoorOpen, MoveVertical, Lock, Cuboid, LogOut, Loader2, Truck, Cog } from "lucide-react";
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

const systemControls = [{
  id: "bay-door-control",
  name: "BAY DOOR",
  icon: DoorOpen,
  description: "Door Control Actions",
  gradient: "from-accent to-primary"
}, {
  id: "locker-control",
  name: "LOCKER",
  icon: Lock,
  description: "Locker Control Actions",
  gradient: "from-secondary to-primary"
}, {
  id: "conveyor-control",
  name: "CONVEYOR",
  icon: Cuboid,
  description: "Belt Control Actions",
  gradient: "from-accent to-secondary"
}, {
  id: "scissor-lift-control",
  name: "SCISSOR LIFT",
  icon: MoveVertical,
  description: "Lift Control Actions",
  gradient: "from-primary to-accent"
}, {
  id: "shuttle-control",
  name: "SHUTTLE",
  icon: Truck,
  description: "Shuttle Control Actions",
  gradient: "from-secondary to-accent"
}, {
  id: "scara-control",
  name: "SCARA",
  icon: Cog,
  description: "SCARA Control Actions",
  gradient: "from-primary to-secondary"
}];
const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, token } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<string>("");
  const [selectedTray, setSelectedTray] = useState<string>("");
  const [trays, setTrays] = useState<Tray[]>([]);
  const [loading, setLoading] = useState(false);
  const [isControlDrawer, setIsControlDrawer] = useState(false);
  const [lockerStatus, setLockerStatus] = useState<any>(null);
  const [conveyorStatus, setConveyorStatus] = useState<any>(null);
  const [bayDoorStatus, setBayDoorStatus] = useState<any>(null);
  const [shuttleStatus, setShuttleStatus] = useState<any>(null);
  const [scaraStatus, setScaraStatus] = useState<any>(null);
  const [statusInterval, setStatusInterval] = useState<NodeJS.Timeout | null>(null);

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
    setIsControlDrawer(false);
    setDrawerOpen(true);
    
    if (systemName === "SCARA") {
      // Show dummy items for SCARA
      setTrays([
        { id: 1, tray_id: "1", tray_status: "available", tray_height: 50, tray_weight: 2, tray_divider: 1 },
        { id: 2, tray_id: "2", tray_status: "available", tray_height: 75, tray_weight: 3, tray_divider: 1 },
        { id: 3, tray_id: "3", tray_status: "available", tray_height: 60, tray_weight: 2.5, tray_divider: 1 },
        { id: 4, tray_id: "4", tray_status: "available", tray_height: 55, tray_weight: 2.2, tray_divider: 1 },
        { id: 5, tray_id: "5", tray_status: "available", tray_height: 65, tray_weight: 2.8, tray_divider: 1 },
        { id: 6, tray_id: "6", tray_status: "available", tray_height: 70, tray_weight: 3.2, tray_divider: 1 },
      ]);
    } else {
      fetchTrays();
    }
  };

  const fetchStatus = async (topic: string, setStatus: (data: any) => void) => {
    console.log(`Fetching status for topic: ${topic}`);
    try {
      const response = await fetch(
        `https://eventinternal.leapmile.com/pubsub/subscribe?topic=${topic}&num_records=1`,
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ`
          }
        }
      );
      
      const data = await response.json();
      console.log(`Status data for ${topic}:`, data);
      if (data.records && data.records.length > 0) {
        console.log(`Setting status for ${topic}:`, data.records[0]);
        setStatus(data.records[0]);
      } else {
        console.log(`No records found for ${topic}`);
      }
    } catch (error) {
      console.error(`Failed to fetch status for ${topic}:`, error);
    }
  };

  const handleControlClick = async (controlName: string) => {
    console.log(`Opening control drawer for: ${controlName}`);
    setSelectedSystem(controlName);
    setIsControlDrawer(true);
    setDrawerOpen(true);
    
    // Clear existing interval if any
    if (statusInterval) {
      console.log('Clearing existing interval');
      clearInterval(statusInterval);
      setStatusInterval(null);
    }
    
    setLoading(true);
    try {
      let topic = '';
      let setStatus: ((data: any) => void) | null = null;
      
      if (controlName === "LOCKER") {
        topic = "1002222";
        setStatus = setLockerStatus;
      } else if (controlName === "CONVEYOR") {
        topic = "Conveyor";
        setStatus = setConveyorStatus;
      } else if (controlName === "BAY DOOR") {
        topic = "Bay";
        setStatus = setBayDoorStatus;
      } else if (controlName === "SHUTTLE") {
        topic = "Shuttle";
        setStatus = setShuttleStatus;
      } else if (controlName === "SCARA") {
        topic = "Scara";
        setStatus = setScaraStatus;
      }
      
      if (topic && setStatus) {
        console.log(`Setting up polling for ${controlName} with topic ${topic}`);
        
        // Initial fetch
        await fetchStatus(topic, setStatus);
        
        // Set up interval for Conveyor, Bay Door, Shuttle, and Scara
        if (controlName === "CONVEYOR" || controlName === "BAY DOOR" || controlName === "SHUTTLE" || controlName === "SCARA") {
          console.log(`Starting 3-second interval for ${controlName}`);
          const interval = setInterval(() => {
            console.log(`Interval tick for ${controlName}`);
            fetchStatus(topic, setStatus);
          }, 3000);
          setStatusInterval(interval);
        }
      }
    } catch (error) {
      console.error("Failed to fetch status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup interval when drawer closes
  useEffect(() => {
    return () => {
      if (statusInterval) {
        console.log('Cleanup: Clearing interval on unmount or drawer close');
        clearInterval(statusInterval);
      }
    };
  }, [statusInterval]);

  useEffect(() => {
    if (!drawerOpen && statusInterval) {
      console.log('Drawer closed, clearing interval');
      clearInterval(statusInterval);
      setStatusInterval(null);
    }
  }, [drawerOpen]);


  const handleBayDoorAction = async (action: "open_door" | "close_door") => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://eventinternal.leapmile.com/pubsub/publish?topic=Bay',
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ action })
        }
      );
      
      const data = await response.json();
      toast({
        title: "Bay Door Action",
        description: `${action.charAt(0).toUpperCase() + action.slice(1)} action executed successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute action",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLockerAction = async (action: "open" | "close") => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://eventinternal.leapmile.com/pubsub/publish?topic=1002222',
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ action })
        }
      );
      
      const data = await response.json();
      toast({
        title: "Locker Action",
        description: `${action.charAt(0).toUpperCase() + action.slice(1)} action executed successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute action",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConveyorAction = async (action: "eject" | "inject") => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://eventinternal.leapmile.com/pubsub/publish?topic=Conveyor',
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ action })
        }
      );
      
      const data = await response.json();
      toast({
        title: "Conveyor Action",
        description: `${action.charAt(0).toUpperCase() + action.slice(1)} action executed successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute action",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScissorLiftAction = async (action: "start" | "stop") => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://eventinternal.leapmile.com/pubsub/publish?topic=SCISSOR_LIFT',
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ action })
        }
      );
      
      const data = await response.json();
      toast({
        title: "Scissor Lift Action",
        description: `${action.charAt(0).toUpperCase() + action.slice(1)} action executed successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute action",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShuttleAction = async (action: "action1" | "action2") => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://eventinternal.leapmile.com/pubsub/publish?topic=Shuttle',
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ action })
        }
      );
      
      const data = await response.json();
      toast({
        title: "Shuttle Action",
        description: `Action ${action === "action1" ? "1" : "2"} executed successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute action",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScaraAction = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://eventinternal.leapmile.com/pubsub/publish?topic=Scara',
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ action: "start_picking" })
        }
      );
      
      const data = await response.json();
      toast({
        title: "SCARA Action",
        description: "Start picking action executed successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute action",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleRequestTray = async () => {
    if (!token || !selectedTray) return;

    setLoading(true);

    if (selectedSystem === "SCARA") {
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
      // Step 1: Check if tray is in progress
      try {
        const inProgressResponse = await fetch(
          `https://robotmanagerv1test.qikpod.com/robotmanager/task?tray_id=${selectedTray}&task_status=inprogress&order_by_field=updated_at&order_by_type=ASC`,
          {
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        const inProgressData = await inProgressResponse.json();
        if (inProgressData.status === 'success' && inProgressData.records?.length > 0) {
          toast({
            title: "Tray In Progress",
            description: `Tray ${selectedTray} is currently in progress.`
          });
          setLoading(false);
          setDrawerOpen(false);
          setSelectedTray("");
          return;
        }
      } catch (error) {
        console.log("In progress check failed, continuing...");
      }

      // Step 2: Check if tray is pending
      try {
        const pendingResponse = await fetch(
          `https://robotmanagerv1test.qikpod.com/robotmanager/task?tray_id=${selectedTray}&task_status=pending&order_by_field=updated_at&order_by_type=ASC`,
          {
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        const pendingData = await pendingResponse.json();
        if (pendingData.status === 'success' && pendingData.records?.length > 0) {
          toast({
            title: "Tray Pending",
            description: `Tray ${selectedTray} is pending.`
          });
          setLoading(false);
          setDrawerOpen(false);
          setSelectedTray("");
          return;
        }
      } catch (error) {
        console.log("Pending check failed, continuing...");
      }

      // Step 3: Check if tray is ready
      try {
        const readyResponse = await fetch(
          `https://robotmanagerv1test.qikpod.com/robotmanager/is_tray_ready?tray_id=${selectedTray}`,
          {
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        const readyData = await readyResponse.json();
        if (readyData.status === 'success') {
          toast({
            title: "Tray Ready",
            description: `Tray ${selectedTray} is already at the station.`
          });
          setLoading(false);
          setDrawerOpen(false);
          setSelectedTray("");
          return;
        }
      } catch (error) {
        console.log("Ready check failed, continuing...");
      }

      // Step 4: Retrieve tray
      try {
        const response = await fetch(
          `https://robotmanagerv1test.qikpod.com/robotmanager/retrieve_tray?tray_id=${selectedTray}&required_tags=station&required_tags=${selectedSystem}`,
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
            title: "Tray Retrieved",
            description: `Tray ${selectedTray} retrieval initiated via ${selectedSystem}.`
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to retrieve tray",
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
          <p className="text-sm text-muted-foreground">Direct system controls</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {systemControls.map((control, index) => <div key={control.id} className="animate-scale-in" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              <FeatureCard {...control} onClick={() => handleControlClick(control.name)} />
            </div>)}
        </div>


        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent className="h-[65vh]">
            <DrawerHeader className="border-b pb-4">
              <DrawerTitle className="text-xl font-bold flex items-center gap-2">
                {isControlDrawer && selectedSystem === "LOCKER" && (
                  <>
                    <Lock className="h-6 w-6" />
                    Locker Controls
                  </>
                )}
                {isControlDrawer && selectedSystem === "CONVEYOR" && (
                  <>
                    <Cuboid className="h-6 w-6" />
                    Conveyor Controls
                  </>
                )}
                {isControlDrawer && selectedSystem === "BAY DOOR" && (
                  <>
                    <DoorOpen className="h-6 w-6" />
                    Bay Door Controls
                  </>
                )}
                {isControlDrawer && selectedSystem === "SHUTTLE" && (
                  <>
                    <Truck className="h-6 w-6" />
                    Shuttle Controls
                  </>
                )}
                {isControlDrawer && selectedSystem === "SCARA" && (
                  <>
                    <Cog className="h-6 w-6" />
                    SCARA Controls
                  </>
                )}
                {!isControlDrawer && selectedSystem}
              </DrawerTitle>
            </DrawerHeader>
            
            <div className="flex flex-col h-full p-4 overflow-hidden">
              {isControlDrawer ? (
                <>
                  {selectedSystem === "BAY DOOR" && (
                    <div className="flex-1 flex flex-col gap-4">
                      {bayDoorStatus && (
                        <div className="bg-card border-2 border-border rounded-lg p-4 mb-4">
                          <h3 className="text-lg font-semibold text-foreground mb-3">Current Status</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Topic:</span>
                              <span className="text-foreground font-medium">{bayDoorStatus.topic}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Last Action:</span>
                              <span className="text-foreground font-medium capitalize">{bayDoorStatus.message?.action?.replace(/_/g, ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Timestamp:</span>
                              <span className="text-foreground font-medium">{new Date(bayDoorStatus.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex-1 flex flex-col gap-4 justify-center">
                        <Button 
                          onClick={() => handleBayDoorAction("open_door")} 
                          disabled={loading}
                          className="w-full py-8 text-xl font-semibold"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Open Door"
                          )}
                        </Button>
                        <Button 
                          onClick={() => handleBayDoorAction("close_door")} 
                          disabled={loading}
                          className="w-full py-8 text-xl font-semibold"
                          variant="secondary"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Close Door"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                  {selectedSystem === "LOCKER" && (
                    <div className="flex-1 flex flex-col gap-4">
                      {lockerStatus && (
                        <div className="bg-card border-2 border-border rounded-lg p-4 mb-4">
                          <h3 className="text-lg font-semibold text-foreground mb-3">Current Status</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Topic:</span>
                              <span className="text-foreground font-medium">{lockerStatus.topic}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Last Action:</span>
                              <span className="text-foreground font-medium capitalize">{lockerStatus.message?.action}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Timestamp:</span>
                              <span className="text-foreground font-medium">{new Date(lockerStatus.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex-1 flex flex-col gap-4 justify-center">
                        <Button 
                          onClick={() => handleLockerAction("open")} 
                          disabled={loading}
                          className="w-full py-8 text-xl font-semibold"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Open"
                          )}
                        </Button>
                        <Button 
                          onClick={() => handleLockerAction("close")} 
                          disabled={loading}
                          className="w-full py-8 text-xl font-semibold"
                          variant="secondary"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Close"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                  {selectedSystem === "CONVEYOR" && (
                    <div className="flex-1 flex flex-col gap-4">
                      {conveyorStatus && (
                        <div className="bg-card border-2 border-border rounded-lg p-4 mb-4">
                          <h3 className="text-lg font-semibold text-foreground mb-3">Current Status</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Topic:</span>
                              <span className="text-foreground font-medium">{conveyorStatus.topic}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Last Action:</span>
                              <span className="text-foreground font-medium capitalize">{conveyorStatus.message?.action}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Timestamp:</span>
                              <span className="text-foreground font-medium">{new Date(conveyorStatus.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex-1 flex flex-col gap-4 justify-center">
                        <Button 
                          onClick={() => handleConveyorAction("eject")} 
                          disabled={loading}
                          className="w-full py-8 text-xl font-semibold"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Eject Tray"
                          )}
                        </Button>
                        <Button 
                          onClick={() => handleConveyorAction("inject")} 
                          disabled={loading}
                          className="w-full py-8 text-xl font-semibold"
                          variant="secondary"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Inject Tray"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                  {selectedSystem === "SCISSOR LIFT" && (
                    <div className="flex-1 flex flex-col gap-4 justify-center">
                      <Button 
                        onClick={() => handleScissorLiftAction("start")} 
                        disabled={loading}
                        className="w-full py-8 text-xl font-semibold"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Start"
                        )}
                      </Button>
                      <Button 
                        onClick={() => handleScissorLiftAction("stop")} 
                        disabled={loading}
                        className="w-full py-8 text-xl font-semibold"
                        variant="secondary"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Stop"
                        )}
                      </Button>
                    </div>
                  )}
                  {selectedSystem === "SHUTTLE" && (
                    <div className="flex-1 flex flex-col gap-4">
                      {shuttleStatus && (
                        <div className="bg-card border-2 border-border rounded-lg p-4 mb-4">
                          <h3 className="text-lg font-semibold text-foreground mb-3">Current Status</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Topic:</span>
                              <span className="text-foreground font-medium">{shuttleStatus.topic}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Last Action:</span>
                              <span className="text-foreground font-medium capitalize">{shuttleStatus.message?.action}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Timestamp:</span>
                              <span className="text-foreground font-medium">{new Date(shuttleStatus.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex-1 flex flex-col gap-4 justify-center">
                        <Button 
                          onClick={() => handleShuttleAction("action1")} 
                          disabled={loading}
                          className="w-full py-8 text-xl font-semibold"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Action 1"
                          )}
                        </Button>
                        <Button 
                          onClick={() => handleShuttleAction("action2")} 
                          disabled={loading}
                          className="w-full py-8 text-xl font-semibold"
                          variant="secondary"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Action 2"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                  {selectedSystem === "SCARA" && (
                    <div className="flex-1 flex flex-col gap-4">
                      {scaraStatus && (
                        <div className="bg-card border-2 border-border rounded-lg p-4 mb-4">
                          <h3 className="text-lg font-semibold text-foreground mb-3">Current Status</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Topic:</span>
                              <span className="text-foreground font-medium">{scaraStatus.topic}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Last Action:</span>
                              <span className="text-foreground font-medium capitalize">{scaraStatus.message?.action?.replace(/_/g, ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Timestamp:</span>
                              <span className="text-foreground font-medium">{new Date(scaraStatus.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex-1 flex flex-col gap-4 justify-center">
                        <Button 
                          onClick={handleScaraAction} 
                          disabled={loading}
                          className="w-full py-8 text-xl font-semibold"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Start Picking"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </DrawerContent>
        </Drawer>

      </div>
    </div>;
};
export default Dashboard;