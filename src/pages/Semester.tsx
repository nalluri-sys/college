import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { useMaterials, getMaterialTypeName, getMaterialTypeIcon, getMaterialDownloadUrl, DbMaterial } from "@/hooks/useMaterials";
import { semesters } from "@/data/materials";
import { ChevronLeft, ChevronRight, FileText, Download, BookOpen, Filter, Loader2, ExternalLink, Trash2 } from "lucide-react";
import { useState } from "react";
import { uploadService } from "@/services/uploadService";
import { adminAuthService } from "@/services/adminAuthService";
import { useToast } from "@/hooks/use-toast";

const Semester = () => {
  const { id } = useParams();
  const semesterId = parseInt(id || "1");
  const semesterInfo = semesters.find((s) => s.id === semesterId);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();
  const isAdmin = adminAuthService.isLoggedIn();

  const { data: materials, isLoading, refetch } = useMaterials(semesterId);

  const handleDelete = async (materialId: number) => {
    if (!window.confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      return;
    }

    setDeletingId(materialId);
    try {
      await uploadService.deleteMaterial(materialId);
      toast({
        title: "Success",
        description: "Material deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete material",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (!semesterInfo) {
    return <Navigate to="/materials" replace />;
  }

  const prevSemester = semesterId > 1 ? semesterId - 1 : null;
  const nextSemester = semesterId < 7 ? semesterId + 1 : null;

  // Get unique subjects and types from database materials
  const subjects = materials ? [...new Set(materials.map((m) => m.subject))] : [];
  const materialTypes = materials ? [...new Set(materials.map((m) => m.type))] : [];

  const filteredMaterials = materials?.filter((material) => {
    const typeMatch = selectedType === "all" || material.type === selectedType;
    const subjectMatch = selectedSubject === "all" || material.subject === selectedSubject;
    return typeMatch && subjectMatch;
  }) || [];

  const semesterFAQs = [
    {
      question: `What subjects are covered in Semester ${semesterId}?`,
      answer: subjects.length > 0 
        ? `Semester ${semesterId} includes materials for ${subjects.join(", ")}. Each subject has lecture notes, previous year papers, and additional resources.`
        : `Materials for Semester ${semesterId} will be uploaded by the admin. Check back soon!`,
    },
    {
      question: "How do I download multiple files at once?",
      answer: "Currently, you can download files individually. We're working on a bulk download feature. For now, you can download the subject-wise zip files available in the resources section.",
    },
    {
      question: "Are these materials aligned with the current syllabus?",
      answer: "Yes, all materials are updated according to the latest VVIT syllabus. If you find any outdated content, please report it using the feedback form.",
    },
    {
      question: "Can I contribute notes for this semester?",
      answer: "Contact the administrator to contribute your notes. Quality submissions will be reviewed and added to the collection.",
    },
  ];

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <Helmet>
        <title>{semesterInfo.title} Materials - VVIT Materials Hub</title>
        <meta
          name="description"
          content={`Access all ${semesterInfo.title} study materials for VVIT engineering. Download lecture notes, previous papers, assignments and more.`}
        />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />

        <main className="pt-16">
          {/* Header Section */}
          <section className="py-16 bg-hero-gradient relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-64 h-64 bg-accent rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              {/* Navigation */}
              <div className="flex items-center justify-between mb-8">
                {prevSemester ? (
                  <Link to={`/semester/${prevSemester}`}>
                    <Button variant="hero-outline" size="sm" className="gap-1">
                      <ChevronLeft className="w-4 h-4" />
                      Semester {prevSemester}
                    </Button>
                  </Link>
                ) : (
                  <div />
                )}
                {nextSemester && (
                  <Link to={`/semester/${nextSemester}`}>
                    <Button variant="hero-outline" size="sm" className="gap-1">
                      Semester {nextSemester}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>

              <div className="max-w-3xl mx-auto text-center">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-2xl font-bold mb-4"
                  style={{
                    backgroundColor: `hsl(${semesterInfo.color} / 0.2)`,
                    color: `hsl(${semesterInfo.color})`,
                  }}
                >
                  {semesterInfo.id}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                  {semesterInfo.title}
                </h1>
                <p className="text-lg text-primary-foreground/80 mb-8">
                  {semesterInfo.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
                    <BookOpen className="w-5 h-5 text-accent mx-auto mb-1" />
                    <div className="text-xl font-bold text-primary-foreground">{subjects.length}</div>
                    <div className="text-xs text-primary-foreground/70">Subjects</div>
                  </div>
                  <div className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
                    <FileText className="w-5 h-5 text-accent mx-auto mb-1" />
                    <div className="text-xl font-bold text-primary-foreground">{materials?.length || 0}</div>
                    <div className="text-xs text-primary-foreground/70">Materials</div>
                  </div>
                  <div className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
                    <Download className="w-5 h-5 text-accent mx-auto mb-1" />
                    <div className="text-xl font-bold text-primary-foreground">Free</div>
                    <div className="text-xs text-primary-foreground/70">Access</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Subjects Overview */}
          {subjects.length > 0 && (
            <section className="py-8 bg-secondary/50 border-b border-border">
              <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center gap-3">
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(selectedSubject === subject ? "all" : subject)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedSubject === subject
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Materials Section */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : materials && materials.length > 0 ? (
                <>
                  {/* Filters */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Filter by type:</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedType("all")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedType === "all"
                              ? "bg-accent text-accent-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          }`}
                        >
                          All
                        </button>
                        {materialTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => setSelectedType(selectedType === type ? "all" : type)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              selectedType === type
                                ? "bg-accent text-accent-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                          >
                            {getMaterialTypeName(type)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Showing {filteredMaterials.length} of {materials.length} materials
                    </span>
                  </div>

                  {/* Materials Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredMaterials.map((material) => (
                      <MaterialCardDb key={material.id} material={material} formatFileSize={formatFileSize} isAdmin={isAdmin} onDelete={handleDelete} isDeleting={deletingId === material.id} />
                    ))}
                  </div>

                  {filteredMaterials.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No materials found with the selected filters.</p>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedType("all");
                          setSelectedSubject("all");
                        }}
                        className="mt-2"
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Materials Yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Materials for {semesterInfo.title} will be uploaded by the administrator. Please check back soon!
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* CTA */}
          <CTASection
            variant="contribute"
            title={`Have Notes for Semester ${semesterId}?`}
            description="Contact the administrator to contribute your notes and help other students."
          />

          {/* FAQ */}
          <FAQSection
            faqs={semesterFAQs}
            title={`Semester ${semesterId} FAQs`}
          />
        </main>

        <Footer />
      </div>
    </>
  );
};

// Material Card component for database materials
const MaterialCardDb = ({ material, formatFileSize, isAdmin, onDelete, isDeleting }: { material: DbMaterial; formatFileSize: (bytes: number | null) => string; isAdmin: boolean; onDelete: (id: number) => void; isDeleting: boolean }) => {
  const downloadUrl = getMaterialDownloadUrl(material.filename);

  return (
    <div className="group bg-card rounded-xl border border-border p-4 hover:border-primary/50 hover:shadow-card transition-all">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl shrink-0">
          {getMaterialTypeIcon(material.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {material.title}
          </h3>
          <p className="text-sm text-muted-foreground">{material.subject}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="px-2 py-0.5 rounded-full bg-secondary">
              {getMaterialTypeName(material.type)}
            </span>
            {material.file_size && (
              <span>{formatFileSize(material.file_size)}</span>
            )}
            <span>{new Date(material.created_at).toLocaleDateString()}</span>
          </div>
          {material.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{material.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary hover:text-primary-foreground">
              <ExternalLink className="w-5 h-5" />
            </Button>
          </a>
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onDelete(material.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Semester;
