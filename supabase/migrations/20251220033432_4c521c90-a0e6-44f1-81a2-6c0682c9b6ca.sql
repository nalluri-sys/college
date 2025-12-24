-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Create materials table for storing PDF metadata
CREATE TABLE public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 7),
    subject TEXT NOT NULL,
    material_type TEXT NOT NULL DEFAULT 'notes',
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on materials
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Everyone can view materials (public access)
CREATE POLICY "Anyone can view materials" 
ON public.materials 
FOR SELECT 
USING (true);

-- Only admins can insert materials
CREATE POLICY "Admins can insert materials" 
ON public.materials 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update materials
CREATE POLICY "Admins can update materials" 
ON public.materials 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete materials
CREATE POLICY "Admins can delete materials" 
ON public.materials 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for materials
INSERT INTO storage.buckets (id, name, public) 
VALUES ('materials', 'materials', true);

-- Storage policies - anyone can view/download
CREATE POLICY "Anyone can view material files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'materials');

-- Only admins can upload files
CREATE POLICY "Admins can upload material files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'materials' AND public.has_role(auth.uid(), 'admin'));

-- Only admins can update files
CREATE POLICY "Admins can update material files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'materials' AND public.has_role(auth.uid(), 'admin'));

-- Only admins can delete files
CREATE POLICY "Admins can delete material files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'materials' AND public.has_role(auth.uid(), 'admin'));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_materials_updated_at
BEFORE UPDATE ON public.materials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();