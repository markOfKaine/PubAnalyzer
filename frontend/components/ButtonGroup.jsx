import { Button } from "@/components/ui/button";

function ButtonGroup({ options, activeIndex = 0, onSelect }) {
  return (
    <div className="flex rounded-lg overflow-hidden border bg-background shadow-lg">
      {options.map((option, index) => (
        <Button
          key={index}
          variant="secondary"
          size="sm"
          className={`
                        flex-1
                        rounded-none 
                        focus:ring-0
                        hover:bg-primary/80
                        px-4
                        py-2 
                        ${
                          activeIndex === index
                            ? "bg-primary text-secondary-foreground"
                            : "bg-accent/90"
                        }
                        ${index !== options.length - 1 ? "border-r" : ""}
                    `}
          onClick={() => onSelect(index)}
        >
          <div className="flex items-center justify-center space-x-2 w-24">
            {option.image}
            <span>{option.text}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}

export default ButtonGroup;
