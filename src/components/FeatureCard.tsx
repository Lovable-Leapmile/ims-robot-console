import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  gradient: string;
  onClick?: () => void;
}

const FeatureCard = ({ name, icon: Icon, description, gradient, onClick }: FeatureCardProps) => {
  return (
    <Card 
      onClick={onClick}
      className="group relative overflow-hidden bg-card/50 backdrop-blur-xl border-border hover:border-accent/50 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 h-full"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
      
      <div className="relative p-4 md:p-6 flex flex-col items-center text-center space-y-3 md:space-y-4">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
          <Icon className="w-8 h-8 md:w-10 md:h-10 text-accent group-hover:text-primary transition-colors" strokeWidth={1.5} />
        </div>
        
        <div>
          <h3 className="text-base md:text-lg font-bold text-foreground mb-1">{name}</h3>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
        
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Card>
  );
};

export default FeatureCard;
