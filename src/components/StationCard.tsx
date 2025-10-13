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
}

const StationCard = ({ name, icon: Icon, description, details }: StationCardProps) => {
  const { toast } = useToast();

  const handleControl = () => {
    toast({
      title: `${name} Activated`,
      description: "Control interface will be available after API integration",
    });
  };

  return (
    <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-xl border-border hover:border-accent/50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative p-6 space-y-4">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors flex-shrink-0">
            <Icon className="w-7 h-7 text-accent" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground mb-1">{name}</h3>
            <p className="text-sm text-secondary font-medium">{description}</p>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm leading-relaxed">
          {details}
        </p>
        
        <Button
          onClick={handleControl}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Control
        </Button>
      </div>
    </Card>
  );
};

export default StationCard;
