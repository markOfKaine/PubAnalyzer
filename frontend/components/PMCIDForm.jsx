import { Search } from "lucide-react";
import CardBackground from "./CardBackground";

function PMCIDForm() {
  
  const handleSubmit = () => {
  };
  
  return (
    <CardBackground className="px-4 ">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">Enter PMC ID</h2>
      <form className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-card-foreground mb-1"
            htmlFor="pmcId"
          >
            PMC ID
          </label>
          <input
            className="w-full px-4 py-2 border border-input bg-card rounded-md shadow-sm focus:outline-none
          focus:ring focus:ring-primary focus:border-border placeholder:text-muted-foreground"
            type="text"
            id="pmcId"
            placeholder="e.g. PMC1234567"
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center py-2 px-4 space-x-2 transition
          disabled:bg-muted text-background bg-primary border border-transparent rounded-md shadow-sm 
              hover:bg-primary/80"
        >
          <Search size={18} />
          <p>Analyze</p>
        </button>
      </form>
    </CardBackground>
  );
}

export default PMCIDForm;
