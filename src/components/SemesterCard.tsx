import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Semester } from "@/data/materials";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, FileText } from "lucide-react";

interface SemesterCardProps {
  semester: Semester;
}

const SemesterCard = ({ semester }: SemesterCardProps) => {
  const [fileCount, setFileCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFileCount = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/materials?semester=${semester.id}`);
        if (response.ok) {
          const materials = await response.json();
          setFileCount(materials.length);
        }
      } catch (error) {
        console.error("Error fetching file count:", error);
        setFileCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileCount();
  }, [semester.id]);

  return (
    <Link to={`/semester/${semester.id}`}>
      <div className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/50 shadow-soft hover:shadow-card transition-all duration-300 h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold"
            style={{ 
              backgroundColor: `hsl(${semester.color} / 0.1)`,
              color: `hsl(${semester.color})`
            }}
          >
            {semester.id}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            {isLoading ? "..." : fileCount} file{fileCount !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
          {semester.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {semester.description}
        </p>

        {/* Subjects Preview */}
        <div className="flex flex-wrap gap-2 mb-4">
          {semester.subjects.slice(0, 3).map((subject) => (
            <span
              key={subject.id}
              className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
            >
              {subject.code}
            </span>
          ))}
          {semester.subjects.length > 3 && (
            <span className="px-2.5 py-1 rounded-full bg-secondary text-muted-foreground text-xs">
              +{semester.subjects.length - 3} more
            </span>
          )}
        </div>

        {/* CTA */}
        <Button variant="ghost" size="sm" className="group/btn p-0 h-auto text-accent hover:text-accent hover:bg-transparent">
          View Materials
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Link>
  );
};

export default SemesterCard;
