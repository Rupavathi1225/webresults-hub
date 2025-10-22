-- Create webresults table
CREATE TABLE public.webresults (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  link TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  controlled_by TEXT NOT NULL DEFAULT 'Controlled by third-party',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.webresults ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (so anyone can view web results)
CREATE POLICY "Public read access for webresults"
ON public.webresults
FOR SELECT
USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Authenticated users can insert webresults"
ON public.webresults
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy for authenticated users to update
CREATE POLICY "Authenticated users can update webresults"
ON public.webresults
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy for authenticated users to delete
CREATE POLICY "Authenticated users can delete webresults"
ON public.webresults
FOR DELETE
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_webresults_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_webresults_updated_at_trigger
BEFORE UPDATE ON public.webresults
FOR EACH ROW
EXECUTE FUNCTION public.update_webresults_updated_at();