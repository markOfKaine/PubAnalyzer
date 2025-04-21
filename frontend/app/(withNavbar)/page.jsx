"use client";
import Link from "next/link";
import { Search } from "lucide-react";

function Home() {
  return (
    <div className="max-w-2xl mx-auto mt-4 text-center">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Welcome to PubAnalyzer</h1>
      <p className="text-lg mb-8 text-secondary-foreground">
        An easy way to view, analyze, and mark up PubMed Central articles!
      </p>
      <Link href="/analyze">
        <button
          className="inline-flex items-center space-x-2 px-16 py-3 rounded-lg
          bg-primary hover:bg-primary/50 text-background font-semibold"
        >
          <Search size={20} />
          <span>Analyze</span>
        </button>
      </Link>
    </div>
  );
}

export default Home;
