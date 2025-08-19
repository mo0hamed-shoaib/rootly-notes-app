import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ReactNode } from "react";

interface EmptyStateAction {
  label: string;
  href?: string;
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  actionSlot?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  actionSlot,
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center py-10">
      <Card className="w-full max-w-xl text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        <CardContent className="flex items-center justify-center gap-3">
          {actionSlot ? (
            actionSlot
          ) : (
            <>
              {primaryAction?.href ? (
                <Button asChild>
                  <Link href={primaryAction.href}>{primaryAction.label}</Link>
                </Button>
              ) : null}
              {secondaryAction?.href ? (
                <Button variant="outline" asChild>
                  <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
                </Button>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


