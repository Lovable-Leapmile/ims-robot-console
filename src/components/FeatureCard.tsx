import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  gradient: string;
}

const FeatureCard = ({ name, icon: Icon, description, gradient }: FeatureCardProps) => {
  return (
    <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-xl border-border hover:border-accent/50 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 h-full">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
      
      <div className="relative p-3 md:p-4 flex flex-col items-center text-center space-y-2">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-accent group-hover:text-accent transition-colors" />
        </div>
        
        <div>
          <h3 className="text-sm md:text-base font-bold text-foreground mb-0.5">{name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
        </div>
        
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Card>
  );
};

export default FeatureCard;
