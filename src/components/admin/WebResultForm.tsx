import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(1000),
  link: z.string().url("Must be a valid URL"),
  logo_url: z.string().url("Must be a valid URL"),
  controlled_by: z.string().max(100).default("Controlled by third-party"),
});

type FormValues = z.infer<typeof formSchema>;

interface WebResultFormProps {
  initialData?: {
    id: string;
    name: string;
    title: string;
    description: string;
    link: string;
    logo_url: string;
    controlled_by: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const WebResultForm = ({ initialData, onSuccess, onCancel }: WebResultFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      title: initialData.title,
      description: initialData.description,
      link: initialData.link,
      logo_url: initialData.logo_url,
      controlled_by: initialData.controlled_by,
    } : {
      name: "",
      title: "",
      description: "",
      link: "https://",
      logo_url: "https://",
      controlled_by: "Controlled by third-party",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        // Update existing
        const { error } = await supabase
          .from("webresults")
          .update(values)
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Web result updated successfully",
        });
      } else {
        // Create new
        const { error } = await supabase
          .from("webresults")
          .insert([values as any]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Web result created successfully",
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving web result:", error);
      toast({
        title: "Error",
        description: "Failed to save web result",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Topcollegeguide" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., How To Pay for College..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a detailed description..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="controlled_by"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Controlled By</FormLabel>
              <FormControl>
                <Input placeholder="Controlled by third-party" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WebResultForm;
