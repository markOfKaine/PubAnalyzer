"use client";
import {
  FileText,
  Calendar,
  Users,
  BookMarked,
  BookOpenCheck,
  ExternalLink,
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
import Image from "next/image";

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
  } = article;

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
    <Card className="w-full hover:shadow-md transition-all duration-200 hover:border-primary/50">
      <CardHeader className="">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-2 text-primary/70">
            {title}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="px-2 py-0 text-xs">
                  PMC: {pmcid}
                </Badge>
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
        </div>
      </CardHeader>

      <CardContent className="">
        <div className="flex gap-x-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{pubDate}</span>
            <span className="mx-1">•</span>
          </div>
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
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2"
            onClick={(e) => {
              e.stopPropagation();
              window.open(pdfUrl, "_blank");
            }}
          >
            <Image src="/pubby.png" alt="Pubby Logo" width={20} height={20} />
            PubAnalyzer
          </Button>
        </div>

        <div className="flex gap-2">
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
        </div>
      </CardFooter>
    </Card>
  );
}

export default ArticleCard;
