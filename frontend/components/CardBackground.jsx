import {
  Card,
  CardContent,
} from "@/components/ui/card"

function CardBackground({ children }) {
  return (
    <Card className="border-none bg-card rounded-lg shadow-lg p-6">
      <CardContent>
      {children}
      </CardContent>
    </Card>
  );
}

export default CardBackground;