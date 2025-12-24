import { Material, getMaterialTypeIcon, getMaterialTypeName } from "@/data/materials";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

interface MaterialCardProps {
  material: Material;
}

const MaterialCard = ({ material }: MaterialCardProps) => {
  const formatBadgeColor = () => {
    switch (material.format) {
      case 'PDF': return 'bg-destructive/10 text-destructive';
      case 'DOC': return 'bg-primary/10 text-primary';
      case 'PPT': return 'bg-accent/10 text-accent';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="group p-4 rounded-xl bg-card border border-border hover:border-accent/30 shadow-soft hover:shadow-card transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl shrink-0">
          {getMaterialTypeIcon(material.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
              {material.title}
            </h4>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold shrink-0 ${formatBadgeColor()}`}>
              {material.format}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            {getMaterialTypeName(material.type)} • {material.subject}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Download className="w-3 h-3" />
              {material.downloads.toLocaleString()} downloads
            </span>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="h-8 px-3">
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button variant="accent" size="sm" className="h-8 px-3">
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;
