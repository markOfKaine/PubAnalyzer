"use client";

import { useState } from "react";
import { 
  Search,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePMContext } from "@/contexts/PubMedContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EmptyStateHintCard from "@/components/EmptyStateHintCard";
import ArticleCard from "@/components/ArticleCard";


// Define a schema for search validation
const searchSchema = z.object({
  query: z.string()
});

function Analyze() {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { searchAndGetSummaries } = usePMContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize react-hook-form
  const form = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    }
  });

  const onSubmit = async (data, e) => {
    // Prevent default form submission behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setError(null);
    setLoading(true);

    if (data.query.trim() === "") {
      setArticles([]);
      setLoading(false);
      return;
    }
    
    try {
      console.log("Searching for articles with query:", data.query);
      const searchResponse = await searchAndGetSummaries(data.query);
      console.log("Search response:", searchResponse);
      const summaries = searchResponse.summaries || [];

      if (summaries.length > 0) {
        console.log("Articles found:", summaries);
        setArticles(summaries);
        setSearchQuery(data.query);
      } else {
        console.log("No articles found for the given query.");
        setArticles([]);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Failed to fetch articles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen text-foreground">
      <div className="w-1/3 shadow-md px-4 flex flex-col border-r border-border">
        <div className="flex items-center justify-between py-6 border-b border-border ">
          <h1 className="text-2xl font-semibold text-foreground">
            Discover PubMed Articles
          </h1>
        </div>

        {/* Search Form */}
        <div className="pt-4 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="relative h-10">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                          <Input
                            placeholder="Search for articles by keyword, author, or topic..."
                            className="pl-10 h-full w-full"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="default" disabled={loading}>
                  Search
                </Button>
              </div>
            </form>
          </Form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Article List */}
      <div className="w-2/3 overflow-auto space-y-4 p-6 pt-2">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <EmptyStateLoading />
          ) : articles.length === 0 ? (
            <EmptyStateHintCard hintMessage='Try searching for a different medical topic, author, or keyword. You can use terms like "diabetes treatment", "oncology", or specific researcher names.' />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {articles.map((article, index) => (
                <ArticleCard key={article.id || index} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analyze;

const EmptyStateLoading = () => {
  return (
        <div className="flex justify-center items-center h-40">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">
          Searching PubMed for related articles...
        </p>
      </div>
    </div>
  );
}

