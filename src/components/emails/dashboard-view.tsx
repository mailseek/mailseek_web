"use client";

import { useState } from "react";
import {
  Mail,
  Plus,
  Inbox,
  Tag,
  Archive,
  Trash,
  Star,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CategoryList } from "@/components/emails/category-list";

// Mock data for categories
const defaultCategories = [
  { id: "inbox", name: "Inbox", icon: Inbox, count: 24 },
  { id: "important", name: "Important", icon: Star, count: 7 },
  { id: "newsletters", name: "Newsletters", icon: Mail, count: 13 },
  { id: "promotions", name: "Promotions", icon: Tag, count: 21 },
  { id: "archive", name: "Archive", icon: Archive, count: 0 },
  { id: "trash", name: "Trash", icon: Trash, count: 0 },
];

// Mock data for processing jobs
const processingJobs = [
  { id: "job1", subject: "Weekly Newsletter", status: "categorizing" },
  { id: "job2", subject: "Your Amazon Order", status: "categorizing" },
];

export default function DashboardView() {
  const [categories, setCategories] = useState(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState("inbox");
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [showProcessingJobs, setShowProcessingJobs] = useState(true);

  const handleAddCategory = (categoryName: string) => {
    const newCategory = {
      id: categoryName.toLowerCase().replace(/\s+/g, "-"),
      name: categoryName,
      icon: Tag,
      count: 0,
    };

    setCategories([...categories, newCategory]);
    setIsNewCategoryModalOpen(false);
  };

  const dismissProcessingJobs = () => {
    setShowProcessingJobs(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Mailseek</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <AlertCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block">
          <ScrollArea className="h-full py-6 pr-6">
            <div className="flex flex-col gap-4">
              <Button
                className="w-full justify-start gap-2"
                onClick={() => setIsNewCategoryModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                New Category
              </Button>

              <Separator className="my-2" />

              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          </ScrollArea>
        </aside>

        <main className="flex w-full flex-col overflow-hidden">
          {showProcessingJobs && processingJobs.length > 0 && (
            <>
              {processingJobs.length > 110 ? (
                <Alert className="mb-6 mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Processing emails</AlertTitle>
                  <AlertDescription className="flex flex-col gap-2">
                    <p>
                      {processingJobs.length} new emails are currently being
                      categorized by AI...
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={dismissProcessingJobs}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="mb-6 mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>You are up to date!</AlertTitle>
                  <AlertDescription className="flex flex-col gap-2">
                    <p>
                      All new emails have been categorized.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          <div className="flex items-center justify-between mt-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {categories.find((cat) => cat.id === selectedCategory)?.name ||
                  "Emails"}
              </h1>
              <p className="text-muted-foreground">
                Browse and manage your emails by category
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* <EmailList categoryId={selectedCategory} /> */}
        </main>
      </div>
    </div>
  );
}
