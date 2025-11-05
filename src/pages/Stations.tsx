import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import StationCard from "@/components/StationCard";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
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
  const processedTraysRef = useRef<Set<string>>(new Set());
  const currentItemIndexRef = useRef<number>(0);
  const trayItemMapRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    fetchReadyTrays(true);
    
    // Set up auto-refresh every 2 seconds
    const intervalId = setInterval(() => {
      fetchReadyTrays(false);
    }, 2000);
    
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [token]);

  const publishScaraItem = async (tray: ReadyTray) => {
    const itemIds = ['1', '2', '3', '4', '5', '6'];
    const itemId = itemIds[currentItemIndexRef.current];
    
    currentItemIndexRef.current = (currentItemIndexRef.current + 1) % itemIds.length;
    trayItemMapRef.current.set(tray.tray_id, itemId);
    
    try {
      await fetch('https://eventinternal.leapmile.com/pubsub/publish?topic=pick_item_id', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          item_id: itemId,
          action: "outbound",
          tray_id: tray.tray_id,
          station_name: tray.station_name
        })
      });
    } catch (error) {
      console.error('Failed to publish scara item:', error);
    }
  };

  const fetchReadyTrays = async (isInitialLoad = false) => {
    if (!token) return;
    
    // Only show loading state on initial load
    if (isInitialLoad) {
      setLoading(true);
    }
    
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
        
        // Check for new scara-tagged trays
        data.records.forEach((tray: ReadyTray) => {
          const hasScaraTag = tray.tags.some(tag => tag.toLowerCase().includes('scara'));
          if (hasScaraTag && !processedTraysRef.current.has(tray.tray_id)) {
            processedTraysRef.current.add(tray.tray_id);
            publishScaraItem(tray);
          }
        });
      }
    } catch (error) {
      // Only show toast on initial load to avoid spam
      if (isInitialLoad) {
        toast({
          title: "Error",
          description: "Failed to fetch ready trays",
          variant: "destructive"
        });
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  const handleRemoveTray = (trayId: string) => {
    setReadyTrays(prevTrays => prevTrays.filter(tray => tray.tray_id !== trayId));
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
                  onRemoveTray={handleRemoveTray}
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
