"use client";
import { useContext, useState, createContext, useEffect } from "react";
import { apiCall } from "@/utilities/api";

const PubMedContext = createContext();

export const usePMContext = () => useContext(PubMedContext);

export const PubMedProvider = ({ children }) => {
  
  const [loading, setLoading] = useState(false);
  const [pdfURL, setPDFURL] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const savedArticle = localStorage.getItem("pubAnalyzer_selectedArticle");
        return savedArticle ? JSON.parse(savedArticle) : null;
      } catch (error) {
        console.log("Unable to load saved article, error:", error);
        return null;
      }
    }
    console.log("Unable to load saved article");
    return null;
  });

  // Load saved PDF if PMCID is stored in localStorage
  // This will run on initial load to check if a PMCID is saved
  // helpful for refreshing the page without losing the PDF
  useEffect(() => {
    const loadSavedPDF = async () => {
      if (selectedArticle?.pmcid && !pdfURL) {
        await fetchPDFToDisplay(selectedArticle);
      }
    };
    
    loadSavedPDF();
  }, []); 

  // Save selectedArticle to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined" && selectedArticle) {
      try {
        localStorage.setItem(
          "pubAnalyzer_selectedArticle",
          JSON.stringify(selectedArticle)
        );
      } catch (error) {
        console.log("Error saving article to localStorage:", error);
      }
    }
  }, [selectedArticle]);

  // sample pmc id: 10579494
  // Fetch a PDF to display based on the provided PMC ID
  const fetchPDFToDisplay = async (articleData) => {
    setLoading(true);

    try {
      if (articleData) {
        setSelectedArticle(articleData);
      }

      const pmcid = articleData.pmcid
      const encodedPmcid = encodeURIComponent(pmcid);
      const response = await apiCall(`/pmc/display/${encodedPmcid}.pdf`, {
          method: "GET",
        }
      );
      console.log("Response status:", response.status);
      
      if (response.ok) {
        console.log("PDF fetched successfully");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPDFURL(url);

        return { success: true };
      }

      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
    } catch (error) {
      console.error("Error fetching PDF:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Search PMC for articles matching the search term
  const searchPMC = async (searchTerm, maxResults = 20) => {
    const filteredTerm = `${searchTerm} AND open access[filter]`;
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc&term=${encodeURIComponent(filteredTerm)}&retmax=${maxResults}&retmode=json`;
   
    console.log("Searching PMC with:", searchUrl);
  
    try {
      const response = await fetch(searchUrl);

      if (!response.ok) {
        throw new Error(`Error searching PMC:  ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      console.log("Search results:", data);

      // Extract the PMC IDs from the results (these are numeric, without "PMC" prefix)
      const pmcIds = data.esearchresult.idlist;

      if (pmcIds.length === 0) {
        console.log("No results found for search term:", searchTerm);
        return [];
      }

      console.log(
        `Found ${pmcIds.length} results for search term: ${searchTerm}`
      );
      return pmcIds;
    } catch (error) {
      console.error("Error searching PMC:", error);
      return [];
    }
  };

  // When given a list of PMC IDs, get the summaries and meta data for those articles
  const getPMCSummaries = async (pmcIds) => {
    if (!pmcIds || !Array.isArray(pmcIds) || pmcIds.length === 0) {
      console.error("No valid PMC IDs provided");
      return [];
    }

    // Join the numeric IDs with commas for use in the summary request url
    const idString = pmcIds.join(",");
    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pmc&id=${idString}&retmode=json`;
    
    console.log("Getting summaries with:", summaryUrl);
    
    try {
      const response = await fetch(summaryUrl);

      if (!response.ok) {
        throw new Error(`Error fetching summaries:  ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log("Summary results:", data);
      
      const summaries = [];
      
      for (const id of data.result.uids) {
        const article = data.result[id];

        if (!article) {
          console.warn(`Missing article data for ID: ${id} - skipping`);
          continue;
        }
        
        // PMCID
        const pmcidObj = article.articleids?.find(idObj => idObj.idtype === "pmcid");
        const pmcid = pmcidObj?.value || `PMC${id}`;
        
        // DOI
        const doiObj = article.articleids?.find(idObj => idObj.idtype === "doi");
        const doi = doiObj?.value || null;
        
        // PMID
        const pmidObj = article.articleids?.find(idObj => idObj.idtype === "pmid");
        const pmid = pmidObj && pmidObj.value !== "0" ? pmidObj.value : null;

        // Article metadata - no abstract text here, we can fetch it separately if article is selected
        summaries.push({
          id: id,
          pmcid: pmcid,
          pmid: pmid,
          doi: doi,
          title: article.title || 'No title available',
          journal: article.fulljournalname || article.source || 'Unknown journal',
          pubDate: article.pubdate || 'Unknown date',
          authors: Array.isArray(article.authors) 
            ? article.authors.map(author => author.name || 'Unknown').join('/ ')
            : 'No authors listed',
          volume: article.volume || 'N/A',
          issue: article.issue || 'N/A',
          pages: article.pages || 'N/A',
          abstractUrl: `https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcid}/`,
          pdfUrl: `https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcid}/pdf/`,
          abstractText: null,
        });
      }
      
      return summaries;
    } catch (error) {
      console.error("Error getting summaries:", error);
      return [];
    }
  };

  // Search for articles and get their summaries
  const searchAndGetSummaries = async (searchTerm) => {
    console.log(`Searching for articles about "${searchTerm}"...`);
    
    // First search for PMC IDs
    const pmcIds = await searchPMC(searchTerm);
    
    if (pmcIds.length === 0) {
      console.log("No articles found.");
      return {summaries: []};
    }
    
    // Get Summaries + Meta Data for those articles
    const summaries = await getPMCSummaries(pmcIds);
    
    console.log("Article Summaries:", summaries);
    if (summaries.length === 0) {
      console.log("No summaries found.");
      return { summaries: []};
    }
    
    return {summaries: summaries};
  };

  // Fetch the abstract as text for a given PMC ID
  const fetchArticleAbstract = async (pmcid) => {
    const encodedPmcid = encodeURIComponent(pmcid);

    try {
      const response = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pmc&id=${encodedPmcid}&retmode=xml&rettype=abstract`);

      if (!response.ok) {
        throw new Error(`Error fetching abstract for PMC${pmcid}: ${response.status} ${response.statusText}`);
      }

      const xmlString = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const abstractElement = xmlDoc.querySelector('abstract');
      
      if (abstractElement) {
        const paragraphs = abstractElement.querySelectorAll("p");
        const abstractText = Array.from(paragraphs).map((p) => p.textContent.trim()).join(" ");
        console.log("Abstract Found:", abstractText);
        return { success: true, abstract: abstractText };
      }

      throw new Error("No abstract found");
    } catch (error) {
      console.log("Error fetching abstract:", error);
      return { success: false, error: error };
    }    
  }

  const contextValue = {
    pdfURL,
    fetchPDFToDisplay,
    fetchArticleAbstract,
    searchAndGetSummaries,
    getPMCSummaries,
    setSelectedArticle,
    selectedArticle,
  };

  return (
    <PubMedContext.Provider value={contextValue}>
      {children}
    </PubMedContext.Provider>
  );
};