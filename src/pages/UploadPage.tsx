import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { adminAuthService } from "@/services/adminAuthService";
import { uploadService } from "@/services/uploadService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, LogOut, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const UploadPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [type, setType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not logged in
  if (!adminAuthService.isLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }

  const subjects = [
    "Mathematics I", "Mathematics II", "Engineering Physics", "Engineering Chemistry",
    "Engineering Graphics", "C Programming", "Basic Electrical Engineering",
    "Data Structures", "Digital Electronics", "Computer Organization",
    "Operating Systems", "Database Management", "Object Oriented Programming",
    "Software Engineering", "Computer Networks", "Theory of Computation",
    "Compiler Design", "Machine Learning", "Web Technologies",
    "Artificial Intelligence", "Cloud Computing", "Information Security"
  ];

  const materialTypes = [
    { value: "notes", label: "Lecture Notes" },
    { value: "textbook", label: "Textbook" },
    { value: "paper", label: "Question Paper" },
    { value: "assignment", label: "Assignment" },
    { value: "lab", label: "Lab Manual" },
    { value: "ppt", label: "Presentation" }
  ];

  const semesters = [
    { id: "1", name: "1-1" },
    { id: "2", name: "1-2" },
    { id: "3", name: "2-1" },
    { id: "4", name: "2-2" },
    { id: "5", name: "3-1" },
    { id: "6", name: "3-2" },
    { id: "7", name: "4-1" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files.length) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive"
      });
      return;
    }

    if (!title || !subject || !semester || !type) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (files.length === 1) {
        await uploadService.uploadSingle(files[0], {
          title,
          subject,
          semester,
          type
        });
      } else {
        await uploadService.uploadMultiple(files, {
          title,
          subject,
          semester,
          type
        });
      }

      setUploadedCount(prev => prev + files.length);
      toast({
        title: "Upload successful",
        description: `${files.length} file(s) uploaded successfully!`
      });

      // Reset form
      setFiles([]);
      setTitle("");
      setSubject("");
      setSemester("");
      setType("");
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminAuthService.logout();
    navigate("/");
  };

  return (
    <>
      <Helmet>
        <title>Upload Materials - VVIT Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-12 mt-16">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Upload className="w-8 h-8 text-primary" />
                  <h1 className="text-3xl font-bold">Upload Materials</h1>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
              {uploadedCount > 0 && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-lg p-3">
                  <CheckCircle className="w-5 h-5" />
                  <span>{uploadedCount} file(s) uploaded successfully</span>
                </div>
              )}
            </div>

            {/* Upload Form */}
            <div className="bg-card rounded-xl border border-border shadow-soft p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Input */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Select Files</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-input"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    />
                    <label htmlFor="file-input" className="cursor-pointer block">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="font-semibold text-foreground">Click to upload files</p>
                      <p className="text-sm text-muted-foreground">or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-2">PDF, DOC, DOCX, PPT, PPTX, TXT</p>
                    </label>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Material Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Complete Calculus Notes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Semester */}
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger id="semester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((sem) => (
                        <SelectItem key={sem.id} value={sem.id}>
                          {sem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subj) => (
                        <SelectItem key={subj} value={subj}>
                          {subj}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Material Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Material Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {materialTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isLoading || !files.length}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload {files.length > 1 ? `${files.length} Files` : "File"}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Upload Guidelines</h3>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Maximum file size: 10MB per file</li>
                    <li>Supported formats: PDF, DOC, DOCX, PPT, PPTX, TXT</li>
                    <li>You can upload multiple files at once</li>
                    <li>All fields are required before uploading</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default UploadPage;
