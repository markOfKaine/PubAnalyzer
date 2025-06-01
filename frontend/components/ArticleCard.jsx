"use client";
import {
  FileText,
  Calendar,
  Users,
  BookMarked,
  BookOpenCheck,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { usePMContext } from "@/contexts/PubMedContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAnnotationContext } from "@/contexts/AnnotationContext";
import { useUserDocContext } from "@/contexts/UserDocumentContext";

function ArticleCard({ article }) {
  const {
    id,
    pmcid,
    pmid,
    doi,
    title,
    journal,
    pubDate,
    authors,
    volume,
    issue,
    pages,
    abstractUrl,
    pdfUrl,
    abstractText,
  } = article;

  const {
    fetchPDFToDisplay,
    loading,
    fetchArticleAbstract,
    setSelectedArticle,
  } = usePMContext();
  const { getAnnotations } = useAnnotationContext();
  const { addUserDocument } = useUserDocContext();
  const router = useRouter();
  const [isFetchingPDF, setIsFetchingPDF] = useState(false);
  const [error, setError] = useState(null);

  const handleArticleClick = async () => {
    setIsFetchingPDF(true);
    setError(null);

    try {
      const pmcid = article.pmcid;
      const pdfResponse = await fetchPDFToDisplay(article);
      if (pdfResponse.success) {
        if (!article.abstractText) {
          const abstractResponse = await fetchArticleAbstract(id);

          if (abstractResponse.success) {
            article.abstractText = abstractResponse.abstract;
          } else {
            console.error("Failed to fetch abstract:", abstractResponse.error);
          }
        }

        addUserDocument(pmcid);
        await getAnnotations(pmcid);

        setSelectedArticle(article);
        router.push("/viewer");
        return;
      }

      console.log("PDF not available for this article.");
      setError(
        "PDF not available for this article. Please try again or selected a different article."
      );
    } catch (error) {
      console.log("Error - PDF not available for this article. ", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsFetchingPDF(false);
    }
  };

  // Truncate authors if too long
  const displayAuthors = () => {
    if (!authors || authors === "No authors listed") return authors;
    const authorList = authors.split("/ ");
    if (authorList.length <= 3) return authors;
    return `${authorList.slice(0, 3).join(", ")} + ${
      authorList.length - 3
    } more`;
  };

  const fullAuthorsList = () => {
    if (!authors || authors === "No authors listed") return authors;
    const authorList = authors.split("/ ");
    return authorList.join(", ");
  };

  return (
    <div className="relative w-full">
      {isFetchingPDF && (
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm font-medium text-primary">
              Loading PDF...
            </span>
          </div>
        </div>
      )}

      <Card className="w-full hover:shadow-md transition-all duration-200 hover:border-primary/50">
        <CardHeader className="">
          <div className="flex justify-between items-start gap-2">
            {title ? (
              <CardTitle className="text-lg font-semibold line-clamp-2 text-primary/70">
                {title}
              </CardTitle>
            ) : (
              <Skeleton className="h-6 w-3/4" />
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {pmcid ? (
                    <Badge variant="outline" className="px-2 py-0 text-xs">
                      PMC: {pmcid}
                    </Badge>
                  ) : (
                    <Skeleton className="h-5 w-16" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>PMC ID: {pmcid}</p>
                  {pmid && <p>PMID: {pmid}</p>}
                  {doi && <p>DOI: {doi}</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center text-muted-foreground text-sm mt-1 gap-1">
            <BookMarked className="h-3 w-3 mr-1" />
            {journal ? (
              <>
                <span className="font-medium">{journal}</span>
                {volume !== "N/A" && (
                  <>
                    <span className="mx-1">•</span>
                    <span>Vol. {volume}</span>
                  </>
                )}
                {issue !== "N/A" && (
                  <>
                    <span className="mx-1">•</span>
                    <span>Issue {issue}</span>
                  </>
                )}
                {pages !== "N/A" && (
                  <>
                    <span className="mx-1">•</span>
                    <span>pp. {pages}</span>
                  </>
                )}
              </>
            ) : (
              <Skeleton className="h-4 w-48" />
            )}
          </div>
        </CardHeader>

        <CardContent className="">
          <div className="flex gap-x-2 text-sm">
            {pubDate ? (
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{pubDate}</span>
                <span className="mx-1">•</span>
              </div>
            ) : (
              <Skeleton className="h-4 w-20" />
            )}
            {authors ? (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-left line-clamp-1 hover:underline hover:text-primary cursor-help">
                      {displayAuthors()}
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="font-medium">Authors:</p>
                      <p>{fullAuthorsList()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Skeleton className="h-4 w-40" />
              </div>
            )}
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            {title ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2"
                disabled={loading}
                onClick={(e) => {
                  console.log("PubAnalyzer clicked");
                  e.stopPropagation();
                  handleArticleClick();
                }}
              >
                <Image
                  src="/pubby.png"
                  alt="Pubby Logo"
                  width={20}
                  height={20}
                />
                PubAnalyzer
              </Button>
            ) : (
              <Skeleton className="h-8 w-32" />
            )}
          </div>

          <div className="flex gap-2">
            {title ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(abstractUrl, "_blank");
                  }}
                >
                  <BookOpenCheck className="h-4 w-4" />
                  Abstract
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(pdfUrl, "_blank");
                  }}
                >
                  <FileText className="h-4 w-4" />
                  PDF
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (doi) {
                      window.open(`https://doi.org/${doi}`, "_blank");
                    }
                  }}
                  disabled={!doi}
                >
                  <ExternalLink className="h-4 w-4" />
                  View DOI
                </Button>
              </>
            ) : (
              <>
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-24" />
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ArticleCard;
