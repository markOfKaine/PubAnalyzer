import { Search } from "lucide-react";
import CardBackground from "./CardBackground";

function PMCIDForm() {
  
  const handleSubmit = () => {
  };
  
  return (
    <CardBackground className="px-4 ">
      <h2 className="text-xl font-semibold mb-4">Enter PMC ID</h2>
      <form className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-tertiary mb-1"
            htmlFor="pmcId"
          >
            PMC ID
          </label>
          <input
            className="w-full px-4 py-2 border rounded-md border-primary-border focus:border-primary-light"
            type="text"
            id="pmcId"
            placeholder="e.g. PMC1234567"
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center py-2 px-4 rounded-md
      space-x-2 disabled:bg-primary-light bg-primary hover:bg-primary-dark text-secondary"
        >
          <Search size={18} />
          <p>Analyze</p>
        </button>
      </form>
    </CardBackground>
  );
}

export default PMCIDForm;
