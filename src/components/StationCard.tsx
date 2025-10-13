import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Package } from "lucide-react";

interface ReadyTray {
  id: number;
  tray_id: string;
  station_name: string;
  tags: string[];
  task_status: string;
  station_slot_id: string;
}

interface StationCardProps {
  tray: ReadyTray;
  onReleaseSuccess: () => void;
}

const StationCard = ({ tray, onReleaseSuccess }: StationCardProps) => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRelease = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const tagsParams = tray.tags.map(tag => `tags=${tag}`).join('&');
      const response = await fetch(
        `https://robotmanagerv1test.qikpod.com/robotmanager/release_tray?tray_id=${tray.tray_id}&${tagsParams}`,
        {
          method: 'PATCH',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const data = await response.json();
      if (data.status === 'success') {
        toast({
          title: "Tray Released",
          description: `Tray ${tray.tray_id} from station ${tray.station_name} has been released`
        });
        onReleaseSuccess();
      } else {
        toast({
          title: "Error",
          description: "Failed to release tray",
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
  return (
    <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-xl border-border hover:border-accent/50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative p-3 space-y-2">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <Package className="w-5 h-5 text-accent" />
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-foreground mb-0.5">{tray.tray_id}</h3>
            <p className="text-xs text-muted-foreground">Station {tray.station_name}</p>
          </div>
        </div>
        
        <div className="bg-background/50 rounded-lg p-2 text-center space-y-1">
          <p className="text-xs font-semibold text-foreground">{tray.station_slot_id}</p>
          <div className="flex flex-wrap gap-1 justify-center">
            {tray.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={handleRelease} 
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs py-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Releasing..." : "Release"}
        </Button>
      </div>
    </Card>
  );
};
export default StationCard;