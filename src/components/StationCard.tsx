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
const StationCard = ({
  name,
  icon: Icon,
  description,
  trayId
}: StationCardProps) => {
  const {
    toast
  } = useToast();
  const handleRelease = () => {
    toast({
      title: `${name} Released`,
      description: `Tray ${trayId} has been released`
    });
  };
  return <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-xl border-border hover:border-accent/50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative p-3 space-y-2">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-foreground mb-0.5">{name}</h3>
            
          </div>
        </div>
        
        <div className="bg-background/50 rounded-lg p-2 text-center">
          <p className="text-xs font-semibold text-foreground">{trayId}</p>
        </div>
        
        <Button onClick={handleRelease} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs py-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]">
          Release
        </Button>
      </div>
    </Card>;
};
export default StationCard;