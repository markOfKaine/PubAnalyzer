// We may need to increase token limit. The more we can provide the better. 
// Update the slice values to add more context to the prompt.
export const constructPrompt = (userQuestion, selectedHighlight, selectedArticle) => {
  // Define the LLMs role for how they should respond and the context they should use
  let prompt = `You are Pubby, an AI research assistant specializing in biomedical literature. 
  ARTICLE TITLE: ${selectedArticle.title.slice(0, 50) + "..." || "Unknown"} 
  ARTICLE ABSTRACT: ${ selectedArticle.abstractText?.slice(0, 100) + "..." || "Not available"}
`;

  // Add highlighted text
  if (selectedHighlight.content?.text) {
    prompt += `HIGHLIGHTED TEXT: "${selectedHighlight.content.text.slice(0, 150)}"...`;
  }

  // We could add previous messages to help continue conversation
  // const recentMessages = messages.slice(-4);
  // if (recentMessages.length > 0) {
  //   prompt += `\nRECENT CONVERSATION:`;
  //   recentMessages.forEach((msg) => {
  //     prompt += `\n${msg.sender === "user" ? "User" : "Pubby"}: ${msg.content}`;
  //   });
  // }

  // Add the current user question
  prompt += `\n\nUser's current question: ${userQuestion}
  Please respond in a helpful, clear, and concise manner. 
  Focus on providing accurate scientific information based on the article context.`;

  return prompt;
};