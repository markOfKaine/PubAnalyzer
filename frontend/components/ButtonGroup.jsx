import { Button } from "@/components/ui/button";

function ButtonGroup({ options, activeIndex = 0, onSelect }) {
  return (
    <div className="flex rounded-lg overflow-hidden border bg-background shadow-lg">
      {options.map((option, index) => (
        <Button
          key={index}
          variant={activeIndex === index ? "outline" : "secondary"}
          size="sm"
          className={`
                        flex-1
                        rounded-none 
                        focus:ring-0
                        px-4
                        py-2 
                        ${
                          activeIndex === index
                            ? "bg-primary-foreground text-primary"
                            : ""
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
