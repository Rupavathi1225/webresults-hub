import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import WebResultForm from "@/components/admin/WebResultForm";
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WebResultsAdmin = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: results, isLoading } = useQuery({
    queryKey: ["admin-webresults"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webresults")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (result: any) => {
    setSelectedResult(result);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("webresults")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Web result deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["admin-webresults"] });
      queryClient.invalidateQueries({ queryKey: ["webresults"] });
    } catch (error) {
      console.error("Error deleting web result:", error);
      toast({
        title: "Error",
        description: "Failed to delete web result",
        variant: "destructive",
      });
    } finally {
      setIsDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedResult(null);
    queryClient.invalidateQueries({ queryKey: ["admin-webresults"] });
    queryClient.invalidateQueries({ queryKey: ["webresults"] });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Web Results Management
            </h1>
            <p className="text-muted-foreground">
              Manage your web results content
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedResult(null);
              setIsFormOpen(true);
            }}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Result
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : results && results.length > 0 ? (
          <div className="gradient-card rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Controlled By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <img
                        src={result.logo_url}
                        alt={result.name}
                        className="w-10 h-10 rounded object-cover bg-muted"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{result.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {result.title}
                    </TableCell>
                    <TableCell>
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="max-w-[200px] truncate">
                          {result.link}
                        </span>
                      </a>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {result.controlled_by}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(result)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDeleteId(result.id);
                            setIsDeleteOpen(true);
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="gradient-card rounded-lg border border-border/50 p-12 text-center">
            <p className="text-muted-foreground text-lg mb-4">
              No web results yet. Create your first one!
            </p>
            <Button
              onClick={() => {
                setSelectedResult(null);
                setIsFormOpen(true);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Result
            </Button>
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedResult ? "Edit Web Result" : "Add New Web Result"}
            </DialogTitle>
          </DialogHeader>
          <WebResultForm
            initialData={selectedResult}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedResult(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the web
              result.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WebResultsAdmin;
