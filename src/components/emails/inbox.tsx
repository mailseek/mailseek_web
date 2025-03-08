"use client";

import { Suspense, useEffect, useState } from "react";
import { getMessages } from "../../actions/messages";
import { Message, Category } from "../../types/messages";
import { EmailItem } from "./email-item";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
type Props = {
  userId: string;
  selectedCategoryId: string;
  categories: Category[];
  messages: Message[];
  setMessages: (messages: Message[]) => void;
};

export default function Inbox({
  userId,
  selectedCategoryId,
  categories,
  messages,
  setMessages,
}: Props) {
  const [category, setCategory] = useState<Category | null>(categories.find((cat) => cat.id === selectedCategoryId) || null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await getMessages(userId, selectedCategoryId);
        setMessages(data.messages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [userId, selectedCategoryId]);

  useEffect(() => {
    setCategory(categories.find((cat) => cat.id === selectedCategoryId) || null);
  }, [categories, selectedCategoryId]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {category?.name || "Emails"}
          </h1>
          <p className="text-muted-foreground">
            {category?.definition || "Browse and manage your emails by category"}
          </p>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="border rounded-lg overflow-hidden">
        <Suspense fallback={<Fallback loading={loading} />}>
        <div className="divide-y">
          {messages.length > 0 ? (
            messages.map((message) => (
              <EmailItem key={message.id} message={message} />
            ))
          ) : (
            <Fallback loading={loading} />
          )}
        </div>
        </Suspense>
      </div>
    </div>
  );
}

function Fallback(props: { loading: boolean }) {
  if (props.loading) {
    return (
      <div className="py-4 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }
  return (
    <div className="py-4 text-center text-muted-foreground">
      No emails yet in this category
    </div>
  );
}
