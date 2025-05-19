"use client";
import { useContext, useState, createContext, useEffect } from "react";

const PubMedContext = createContext();

export const usePMContext = () => useContext(PubMedContext);

export const PubMedProvider = ({ children }) => {
  
  const [pdfURL, setPDFURL] = useState(null);
  const [loading, setLoading] = useState(false);

  // TODO: TW - Replace with actual API endpoint
  // sample pmc id: 10579494

  const fetchPDFToDisplay = async (pmcid) => {
    setLoading(true);

    try {
      const encodedPmcid = encodeURIComponent(pmcid);
      console.log("Fetching PDF for PMCID:", encodedPmcid);
      console.log("Fetching PDF from:", `http://127.0.0.1:8000/pmc/display/${encodedPmcid}.pdf`);
      const response = await fetch(`http://127.0.0.1:8000/pmc/display/${encodedPmcid}.pdf`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      console.log("Response status:", response.status);
      
      if (response.ok) {
        console.log("PDF fetched successfully");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPDFURL(url);
        setLoading(false);
        return { success: true };
      }

      console.error("Error fetching PDF:", response.status, response.statusText);
      const errorData = await response.json();
      return { success: false, error: errorData };
    } catch (error) {
      console.error("Error fetching PDF:", error);
      return { success: false, error: error };
    }
  };

  const searchPMC = async (searchTerm, maxResults = 20) => {
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc&term=${encodeURIComponent(searchTerm)}&retmax=${maxResults}&retmode=json`;
  
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

        summaries.push({
          id: pmcid,
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
          pdfUrl: `https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcid}/pdf/`
        });
      }
      
      return summaries;
    } catch (error) {
      console.error("Error getting summaries:", error);
      return [];
    }
  };

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

  const contextValue = {
    pdfURL,
    fetchPDFToDisplay,
    searchAndGetSummaries,
  };

  return (
    <PubMedContext.Provider value={contextValue}>
      {children}
    </PubMedContext.Provider>
  );
};
