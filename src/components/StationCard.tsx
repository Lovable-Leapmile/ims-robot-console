import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface StationCardProps {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  details: string;
  trayId: string;
  trayParts: string[];
}

const StationCard = ({ name, icon: Icon, description, trayId, trayParts }: StationCardProps) => {
  const { toast } = useToast();

  const handleRelease = () => {
    toast({
      title: `${name} Released`,
      description: `Tray ${trayId} has been released`,
    });
  };

  return (
    <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-xl border-border hover:border-accent/50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative p-3 space-y-2">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors flex-shrink-0">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-0.5">{name}</h3>
            <p className="text-xs text-secondary font-medium">{description}</p>
          </div>
        </div>
        
        <div className="space-y-1.5 bg-background/50 rounded-lg p-2">
          <p className="text-xs font-semibold text-foreground">Tray: {trayId}</p>
          <div className="space-y-0.5">
            {trayParts.map((part, index) => (
              <p key={index} className="text-xs text-muted-foreground">• {part}</p>
            ))}
          </div>
        </div>
        
        <Button
          onClick={handleRelease}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm py-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Release
        </Button>
      </div>
    </Card>
  );
};

export default StationCard;
