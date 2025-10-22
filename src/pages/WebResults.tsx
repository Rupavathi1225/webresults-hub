import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import WebResultCard from "@/components/WebResultCard";
import { Loader2 } from "lucide-react";

const WebResults = () => {
  const { data: results, isLoading } = useQuery({
    queryKey: ["webresults"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webresults")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Web Results
          </h1>
          <p className="text-muted-foreground">
            Discover curated resources and helpful guides
          </p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : results && results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <WebResultCard
                key={result.id}
                name={result.name}
                title={result.title}
                description={result.description}
                link={result.link}
                logoUrl={result.logo_url}
                controlledBy={result.controlled_by}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No web results available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebResults;
