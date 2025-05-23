import { 
  Card, 
  CardContent, 
} from '@/components/ui/card';
import { 
  Search,
  FileX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";

const EmptyStateHintCard = ({hintMessage, discover}) => {
  const router = useRouter();

  return (
    <Card className="border border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          { discover ? (
            <FileX className="h-12 w-12 text-muted-foreground  mb-4 opacity-50" />
          ) : (
            <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          )}
          <h3 className="text-lg font-medium mb-1">No articles found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            {hintMessage}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default EmptyStateHintCard;