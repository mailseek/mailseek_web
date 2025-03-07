"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name: string
  icon: LucideIcon
  count: number
}

interface CategoryListProps {
  categories: Category[]
  selectedCategory: string
  onSelectCategory: (categoryId: string) => void
}

export function CategoryList({ categories, selectedCategory, onSelectCategory }: CategoryListProps) {
  return (
    <div className="space-y-1">
      <h3 className="px-2 text-sm font-medium">Categories</h3>
      <div className="space-y-1">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            size="sm"
            className={cn("w-full justify-start gap-2", selectedCategory === category.id && "bg-muted")}
            onClick={() => onSelectCategory(category.id)}
          >
            <category.icon className="h-4 w-4" />
            <span className="flex-1 text-left">{category.name}</span>
            {category.count > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {category.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
