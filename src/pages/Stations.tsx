import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import StationCard from "@/components/StationCard";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ReadyTray {
  id: number;
  tray_id: string;
  station_name: string;
  tags: string[];
  task_status: string;
  station_slot_id: string;
}

const Stations = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();
  const [readyTrays, setReadyTrays] = useState<ReadyTray[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReadyTrays();
    
    // Set up auto-refresh every 2 seconds
    const intervalId = setInterval(() => {
      fetchReadyTrays();
    }, 2000);
    
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [token]);

  const fetchReadyTrays = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        'https://robotmanagerv1test.qikpod.com/robotmanager/is_tray_ready',
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const data = await response.json();
      if (data.status === 'success' && data.records) {
        setReadyTrays(data.records);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch ready trays",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading ready trays...
          </div>
        ) : readyTrays.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No ready trays available
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {readyTrays.map((tray, index) => (
              <div
                key={tray.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <StationCard 
                  tray={tray}
                  onReleaseSuccess={fetchReadyTrays}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stations;
