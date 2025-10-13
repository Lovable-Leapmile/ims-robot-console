import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cpu, Boxes, DoorOpen, MoveVertical, Lock, Cuboid } from "lucide-react";
import StationCard from "@/components/StationCard";

const stations = [
  {
    id: "amr",
    name: "AMR",
    icon: Cpu,
    description: "Retrieval & Storage Demo Zone",
    details: "Autonomous Mobile Robots for material transport and warehouse automation",
    trayId: "TID-1000100",
    trayParts: ["Motor Assembly", "Control Board", "Battery Pack"],
  },
  {
    id: "scara",
    name: "SCARA",
    icon: Boxes,
    description: "Pick & Place Operations",
    details: "High-speed articulated robot arm for precise assembly and sorting tasks",
    trayId: "TID-1000101",
    trayParts: ["Gripper Unit", "Servo Motor", "End Effector"],
  },
  {
    id: "bay-door",
    name: "BAY DOOR",
    icon: DoorOpen,
    description: "Automated Access Control",
    details: "Smart bay door system with integrated sensors and remote operation",
    trayId: "TID-1000102",
    trayParts: ["Sensor Module", "Door Controller", "Safety Lock"],
  },
  {
    id: "scissor-lift",
    name: "SCISSOR LIFT",
    icon: MoveVertical,
    description: "Vertical Material Handling",
    details: "Electric scissor lift platform for efficient vertical transportation",
    trayId: "TID-1000103",
    trayParts: ["Hydraulic Pump", "Platform Base", "Safety Rails"],
  },
  {
    id: "locker",
    name: "LOCKER",
    icon: Lock,
    description: "Smart Storage Solutions",
    details: "Automated locker system with electronic access control and monitoring",
    trayId: "TID-1000104",
    trayParts: ["Lock Mechanism", "RFID Reader", "Access Panel"],
  },
  {
    id: "conveyor",
    name: "CONVEYOR",
    icon: Cuboid,
    description: "Belt Conveyor System",
    details: "Automated material flow with sensor-based sorting and tracking",
    trayId: "TID-1000105",
    trayParts: ["Belt Drive", "Roller Set", "Tracking Sensor"],
  },
];

const Stations = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-3 animate-fade-in">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="ghost"
            className="mr-2 hover:bg-primary/20 p-1.5"
            size="icon"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground mb-0.5">
              Robotic Stations
            </h1>
            <p className="text-xs text-muted-foreground">Control and monitor warehouse automation</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {stations.map((station, index) => (
            <div
              key={station.id}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <StationCard {...station} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stations;
