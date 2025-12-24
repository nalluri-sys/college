import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useMaterials, DbMaterial, getMaterialDownloadUrl, getMaterialTypeName } from "@/hooks/useMaterials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { 
  BookOpen, 
  Upload, 
  LogOut, 
  FileText, 
  Trash2, 
  Plus,
  Loader2,
  Download,
  Calendar
} from "lucide-react";

const materialTypes = [
  { value: "notes", label: "Lecture Notes" },
  { value: "textbook", label: "Textbook" },
  { value: "paper", label: "Question Paper" },
  { value: "assignment", label: "Assignment" },
  { value: "lab", label: "Lab Manual" },
  { value: "ppt", label: "Presentation" },
];

const semesters = [1, 2, 3, 4, 5, 6, 7];

const AdminDashboard = () => {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: materials, isLoading: materialsLoading } = useMaterials();

  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    semester: "",
    subject: "",
    material_type: "notes",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Redirect if not admin
  if (!authLoading && (!user || !isAdmin)) {
    return <Navigate to="/admin/login" replace />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload PDF, DOC, DOCX, PPT, or PPTX files only.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.semester || !formData.subject) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique file path
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `semester-${formData.semester}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("materials")
        .upload(filePath, selectedFile);

      if (uploadError) {
        throw uploadError;
      }

      // Save metadata to database
      const { error: dbError } = await supabase.from("materials").insert({
        title: formData.title,
        description: formData.description || null,
        semester: parseInt(formData.semester),
        subject: formData.subject,
        material_type: formData.material_type,
        file_path: filePath,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        uploaded_by: user?.id,
      });

      if (dbError) {
        // Rollback: delete uploaded file
        await supabase.storage.from("materials").remove([filePath]);
        throw dbError;
      }

      toast({
        title: "Upload Successful",
        description: "Material has been uploaded successfully.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        semester: "",
        subject: "",
        material_type: "notes",
      });
      setSelectedFile(null);
      setShowUploadForm(false);

      // Refresh materials list
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "An error occurred while uploading.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (material: DbMaterial) => {
    if (!confirm(`Are you sure you want to delete "${material.title}"?`)) {
      return;
    }

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("materials")
        .remove([material.file_path]);

      if (storageError) {
        console.error("Storage delete error:", storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("materials")
        .delete()
        .eq("id", material.id);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Deleted",
        description: "Material has been deleted successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["materials"] });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "An error occurred while deleting.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - VVIT Materials Hub</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{materials?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Materials</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {materials ? formatFileSize(materials.reduce((sum, m) => sum + (m.file_size || 0), 0)) : "0 B"}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Storage</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">7</p>
                  <p className="text-sm text-muted-foreground">Semesters</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Upload Material</h2>
              <Button 
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                New Upload
              </Button>
            </div>

            {showUploadForm && (
              <form onSubmit={handleUpload} className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Differential Calculus Notes"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      disabled={isUploading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="e.g., Mathematics I"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      disabled={isUploading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester *</Label>
                    <Select
                      value={formData.semester}
                      onValueChange={(value) => setFormData({ ...formData, semester: value })}
                      disabled={isUploading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((sem) => (
                          <SelectItem key={sem} value={sem.toString()}>
                            Semester {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Material Type</Label>
                    <Select
                      value={formData.material_type}
                      onValueChange={(value) => setFormData({ ...formData, material_type: value })}
                      disabled={isUploading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {materialTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the material..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={isUploading}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">File * (PDF, DOC, DOCX, PPT, PPTX)</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={isUploading} className="gap-2">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Material
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowUploadForm(false)}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Materials List */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">All Materials</h2>
            
            {materialsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : materials && materials.length > 0 ? (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Title</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Subject</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Semester</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Type</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Size</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {materials.map((material) => (
                        <tr key={material.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-foreground">{material.title}</p>
                              <p className="text-xs text-muted-foreground">{material.file_name}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground">{material.subject}</td>
                          <td className="px-4 py-3 text-sm text-foreground">Sem {material.semester}</td>
                          <td className="px-4 py-3 text-sm text-foreground">{getMaterialTypeName(material.material_type)}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{formatFileSize(material.file_size)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <a
                                href={getMaterialDownloadUrl(material.file_path)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </a>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(material)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No materials uploaded yet.</p>
                <Button onClick={() => setShowUploadForm(true)} className="mt-4 gap-2">
                  <Plus className="w-4 h-4" />
                  Upload Your First Material
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
