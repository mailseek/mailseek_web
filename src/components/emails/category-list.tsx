"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/messages";
import { Badge } from "../ui/badge";
interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryListProps) {
  return (
    <div className="space-y-1">
      <h3 className="px-2 text-sm font-medium">Categories</h3>
      <div className="space-y-1">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start gap-2",
              selectedCategory && selectedCategory === category.id && "bg-muted"
            )}
            onClick={() => onSelectCategory(category.id)}
          >
            {/* <category.icon className="h-4 w-4" /> */}
            <span className="flex-1 text-left">{category.name}</span>
            {category.message_count > 0 && (
              <Badge
                variant="secondary"
                className={cn(
                  "ml-auto",
                  selectedCategory && selectedCategory === category.id && "bg-background/50"
                )}
              >
                {category.message_count}
              </Badge>
            )}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectCategory("no_category")}
          className={cn(
            "w-full justify-start gap-2",
            selectedCategory && selectedCategory === "no_category" && "bg-muted"
          )}
        >
          <span className="flex-1 text-left">Uncategorized</span>
        </Button>
      </div>
    </div>
  );
}
