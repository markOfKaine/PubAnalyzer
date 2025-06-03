"use client";
import { useState } from "react";
import { Search, Plus, Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmptyStateHintCard from "@/components/EmptyStateHintCard";
import ArticleCard from "@/components/ArticleCard";
import { useRouter } from "next/navigation";
import { useUserDocContext } from "@/contexts/UserDocumentContext";

function UserArticlesPage() {
  const { 
    allUserDocuments, 
    favoriteDocuments, 
    toggleFavorite, 
    isFavorite, 
    loading 
  } = useUserDocContext();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const router = useRouter();

  const filteredArticles = allUserDocuments.filter((article) => {
    if (!article) return false;
    
    try {
      // Search filter logic
      let matchesSearch = true;
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        matchesSearch = (
          (typeof article.title === 'string' && article.title.toLowerCase().includes(searchLower)) ||
          (typeof article.authors === 'string' && article.authors.toLowerCase().includes(searchLower)) ||
          (typeof article.journal === 'string' && article.journal.toLowerCase().includes(searchLower)) ||
          (typeof article.abstract === 'string' && article.abstract.toLowerCase().includes(searchLower)) ||
          (typeof article.abstractText === 'string' && article.abstractText.toLowerCase().includes(searchLower)) ||
          (article.id && article.id.toString().toLowerCase().includes(searchLower)) ||
          (typeof article.pmcid === 'string' && article.pmcid.toLowerCase().includes(searchLower))
        );
      }

      // Favorites filter logic
      const matchesFavorites = !showFavoritesOnly || isFavorite(article.id);
      
      return matchesSearch && matchesFavorites;
    } catch (error) {
      console.error("Error filtering article:", error, article);
      return false;
    }
  });

  const favoriteCount = favoriteDocuments.length;

  return (
    <div className="w-full max-w-4xl mx-auto h-screen text-foreground">
      <div className="flex items-center justify-between p-6 border-b border-border mt-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Your article history
        </h1>
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push("/discover");
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New article
        </Button>
      </div>

      {/* Search Bar and Filters */}
      <div className="pt-4 pb-8 space-y-4">
        <div className="relative h-10">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search your articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-full"
          />
        </div>
        
        {/* Favorites Filter */}
        <div className="flex items-center gap-4">
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="flex items-center gap-2"
          >
            <Heart 
              className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} 
            />
            {showFavoritesOnly ? "Show All" : "Favorites Only"}
            {favoriteCount > 0 && (
              <span className="ml-1 text-xs bg-muted px-2 py-1 rounded-full">
                {favoriteCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Article List */}
      <div className="overflow-y-auto h-[calc(100vh-200px)] space-y-2">
        {loading ? (
          <EmptyStateLoading />
        ) : allUserDocuments.length === 0 ? (
          <EmptyStateHintCard
            hintMessage="No articles in your history. Discover new articles to see them appear here."
            discover={true}
          />
        ) : filteredArticles.length === 0 && showFavoritesOnly ? (
          <EmptyStateHintCard
            hintMessage="No favorite articles yet. Click the heart icon on articles to favorite them."
            discover={false}
          />
        ) : filteredArticles.length === 0 && searchQuery ? (
          <EmptyStateHintCard
            hintMessage={`No articles found matching "${searchQuery}". Try a different search term.`}
            discover={false}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredArticles.map((article, index) => (
              <ArticleCard 
                key={article.id || index} 
                article={article}
                isFavorite={isFavorite(article.id)}
                onToggleFavorite={() => toggleFavorite(article.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserArticlesPage;

const EmptyStateLoading = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">
          Loading your articles...
        </p>
      </div>
    </div>
  );
};