import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground bg-clip-text">
            Welcome to Web Results
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your curated collection of helpful resources and guides, all in one beautiful place
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all"
          >
            <Link to="/webresults">
              <ExternalLink className="w-5 h-5 mr-2" />
              Browse Results
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary/50 hover:bg-primary/10"
          >
            <Link to="/auth">
              <Shield className="w-5 h-5 mr-2" />
              Admin Login
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
          <div className="gradient-card glow-card p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Curated Content</h3>
            <p className="text-sm text-muted-foreground">
              Hand-picked resources to help you succeed
            </p>
          </div>
          <div className="gradient-card glow-card p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Easy Access</h3>
            <p className="text-sm text-muted-foreground">
              Quick links to all your favorite resources
            </p>
          </div>
          <div className="gradient-card glow-card p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Always Updated</h3>
            <p className="text-sm text-muted-foreground">
              Fresh content added regularly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
