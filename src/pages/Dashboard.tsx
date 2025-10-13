import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cpu, Boxes, DoorOpen, MoveVertical, Lock, Cuboid } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";

const features = [
  { 
    id: "amr", 
    name: "AMR", 
    icon: Cpu, 
    description: "Autonomous Mobile Robots",
    gradient: "from-primary to-secondary"
  },
  { 
    id: "scara", 
    name: "SCARA", 
    icon: Boxes, 
    description: "Selective Compliance Robot Arm",
    gradient: "from-secondary to-accent"
  },
  { 
    id: "bay-door", 
    name: "BAY DOOR", 
    icon: DoorOpen, 
    description: "Automated Bay Door Control",
    gradient: "from-accent to-primary"
  },
  { 
    id: "scissor-lift", 
    name: "SCISSOR LIFT", 
    icon: MoveVertical, 
    description: "Vertical Material Handling",
    gradient: "from-primary to-accent"
  },
  { 
    id: "locker", 
    name: "LOCKER", 
    icon: Lock, 
    description: "Smart Storage Solutions",
    gradient: "from-secondary to-primary"
  },
  { 
    id: "conveyor", 
    name: "CONVEYOR", 
    icon: Cuboid, 
    description: "Belt Conveyor System",
    gradient: "from-accent to-secondary"
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            IMS Warehouse Control
          </h1>
          <p className="text-muted-foreground">Select a system to control</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>

        <div className="fixed bottom-8 right-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <Button
            onClick={() => navigate("/stations")}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            Stations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
