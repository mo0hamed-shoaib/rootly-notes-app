import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-xl text-center">
        <CardHeader>
          <CardTitle>Page not found</CardTitle>
          <CardDescription>
            The page you’re looking for doesn’t exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Button asChild>
            <Link href="/">Return home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


