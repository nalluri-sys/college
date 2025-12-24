import { useQuery } from "@tanstack/react-query";

const API_URL = 'http://localhost:5000/api';

export interface DbMaterial {
  id: number;
  title: string;
  subject: string;
  semester: string;
  type: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
  uploadedAt: string;
}

export const useMaterials = (semester?: number) => {
  return useQuery({
    queryKey: ["materials", semester],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (semester) {
        params.append('semester', semester.toString());
      }

      const response = await fetch(`${API_URL}/materials?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch materials');
      }

      return response.json() as Promise<DbMaterial[]>;
    },
  });
};

export const useSubjectsForSemester = (semester: number) => {
  return useQuery({
    queryKey: ["subjects", semester],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/materials?semester=${semester}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch materials');
      }

      const materials: DbMaterial[] = await response.json();

      // Get unique subjects
      const subjects = [...new Set(materials.map((m) => m.subject))];
      return subjects;
    },
  });
};

export const getMaterialDownloadUrl = (filename: string) => {
  return `${API_URL}/download/${filename}`;
};

export const getMaterialTypeIcon = (type: string): string => {
  switch (type) {
    case "notes":
      return "📝";
    case "textbook":
      return "📚";
    case "paper":
      return "📄";
    case "assignment":
      return "✏️";
    case "lab":
      return "🔬";
    case "ppt":
      return "📊";
    default:
      return "📁";
  }
};

export const getMaterialTypeName = (type: string): string => {
  switch (type) {
    case "notes":
      return "Lecture Notes";
    case "textbook":
      return "Textbook";
    case "paper":
      return "Question Paper";
    case "assignment":
      return "Assignment";
    case "lab":
      return "Lab Manual";
    case "ppt":
      return "Presentation";
    default:
      return "Document";
  }
};
