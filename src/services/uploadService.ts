// API service for file uploads using Multer backend
import { adminAuthService } from './adminAuthService';

const API_URL = 'http://localhost:5000/api';

export interface UploadedMaterial {
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

export const uploadService = {
  // Upload single file (Admin only)
  async uploadSingle(file: File, metadata: {
    title: string;
    subject: string;
    semester: string;
    type: string;
  }): Promise<UploadedMaterial> {
    const token = adminAuthService.getToken();
    if (!token) {
      throw new Error('Not authenticated. Please login first.');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', metadata.title);
    formData.append('subject', metadata.subject);
    formData.append('semester', metadata.semester);
    formData.append('type', metadata.type);

    const response = await fetch(`${API_URL}/upload/single`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const data = await response.json();
    return data.material;
  },

  // Upload multiple files (Admin only)
  async uploadMultiple(files: File[], metadata: {
    title?: string;
    subject: string;
    semester: string;
    type: string;
  }): Promise<UploadedMaterial[]> {
    const token = adminAuthService.getToken();
    if (!token) {
      throw new Error('Not authenticated. Please login first.');
    }
    
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    formData.append('subject', metadata.subject);
    formData.append('semester', metadata.semester);
    formData.append('type', metadata.type);
    if (metadata.title) {
      formData.append('title', metadata.title);
    }

    const response = await fetch(`${API_URL}/upload/multiple`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const data = await response.json();
    return data.materials;
  },

  // Get all materials
  async getMaterials(filters?: {
    semester?: string;
    subject?: string;
    type?: string;
  }): Promise<UploadedMaterial[]> {
    const queryParams = new URLSearchParams();
    if (filters?.semester) queryParams.append('semester', filters.semester);
    if (filters?.subject) queryParams.append('subject', filters.subject);
    if (filters?.type) queryParams.append('type', filters.type);

    const response = await fetch(`${API_URL}/materials?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch materials');
    }

    return response.json();
  },

  // Get single material
  async getMaterial(id: number): Promise<UploadedMaterial> {
    const response = await fetch(`${API_URL}/materials/${id}`);
    
    if (!response.ok) {
      throw new Error('Material not found');
    }

    return response.json();
  },

  // Delete material (Admin only)
  async deleteMaterial(id: number): Promise<void> {
    const token = adminAuthService.getToken();
    if (!token) {
      throw new Error('Not authenticated. Please login first.');
    }
    
    const response = await fetch(`${API_URL}/materials/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Delete failed');
    }
  },

  // Get download URL
  getDownloadUrl(filename: string): string {
    return `${API_URL}/download/${filename}`;
  },

  // Get file URL for viewing
  getFileUrl(path: string): string {
    return getApiUrl(path);
  }
};
