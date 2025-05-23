"use client";

import { useState } from "react";
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EmptyStateHintCard from "@/components/EmptyStateHintCard";
import { useRouter } from "next/navigation";

function UserArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // TODO: TW - Replace with actual API call to fetch the users articles.
  const articles = [
    // {
    //   id: 1,
    //   title: "Recent CRISPR-Cas9 Advances in Cancer Immunotherapy",
    //   timestamp: "21 minutes ago"
    // },
    // {
    //   id: 2,
    //   title: "Meta-Analysis: COVID-19 Long-Term Neurological Effects",
    //   timestamp: "27 minutes ago"
    // },
    // {
    //   id: 3,
    //   title: "Single-Cell RNA Sequencing in Cancer Research",
    //   timestamp: "3 days ago"
    // },
    // {
    //   id: 4,
    //   title: "FDA Approval Process for Novel Biologic Therapies",
    //   timestamp: "4 hours ago"
    // },
    // {
    //   id: 5,
    //   title: "Machine Learning Applications in Diagnostic Radiology",
    //   timestamp: "10 hours ago"
    // },
  ];
  
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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

      {/* Search Bar */}
      <div className="pt-4 pb-8">
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
      </div>

      {/* Article List */}
      <div className="overflow-y-auto h-[calc(100vh-200px)] space-y-2">
        {filteredArticles.length === 0 ? (
          <EmptyStateHintCard
            hintMessage="No articles in your history. Discover new articles to see them appear here."
            discover={true}
          />
        ) : (
          filteredArticles.map((article) => (
            <div
              key={article.id}
              className="flex flex-col px-6 py-4 hover:bg-primary/20 cursor-pointer transition-colors rounded-lg border border-border"
            >
              <h3 className="font-medium text-foreground truncate">
                {article.title}
              </h3>
              <div className="flex items-baseline gap-2 mt-1 text-sm text-muted-foreground">
                <span>{"Last Edit"}</span>
                <span>{article.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserArticlesPage;
