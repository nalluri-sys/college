import { Folder, Download, Search, Clock, Shield, Users } from "lucide-react";

const features = [
  {
    icon: Folder,
    title: "Semester-wise Organization",
    description: "All materials neatly organized by semester and subject for easy navigation.",
  },
  {
    icon: Download,
    title: "Multiple Formats",
    description: "Access resources in PDF, DOC, PPT formats. Download anytime, anywhere.",
  },
  {
    icon: Search,
    title: "Easy Search",
    description: "Find exactly what you need with our intuitive search and filter system.",
  },
  {
    icon: Clock,
    title: "Regularly Updated",
    description: "Fresh content added regularly including latest question papers and notes.",
  },
  {
    icon: Shield,
    title: "Quality Verified",
    description: "All materials are reviewed and verified by seniors and faculty.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Built by students, for students. Contribute and help your juniors.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-muted-foreground text-lg">
            We've built the ultimate resource platform to support your engineering journey from day one to graduation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/30 shadow-soft hover:shadow-card transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
