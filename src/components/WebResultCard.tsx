import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WebResultCardProps {
  name: string;
  title: string;
  description: string;
  link: string;
  logoUrl: string;
  controlledBy: string;
}

const WebResultCard = ({
  name,
  title,
  description,
  link,
  logoUrl,
  controlledBy,
}: WebResultCardProps) => {
  return (
    <Card className="glow-card gradient-card border-border/50 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0">
            <img
              src={logoUrl}
              alt={`${name} logo`}
              className="w-16 h-16 rounded-lg object-cover bg-muted"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-foreground mb-1 truncate">
              {name}
            </h3>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
            >
              {link}
            </a>
          </div>
        </div>

        <h4 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {title}
        </h4>

        <p className="text-muted-foreground mb-4 line-clamp-3">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all"
          >
            <a href={link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Website
            </a>
          </Button>
          <span className="text-xs text-muted-foreground">
            {controlledBy}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebResultCard;
