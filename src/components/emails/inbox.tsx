"use client";

import { useEffect, useState } from "react";
import { getMessages } from "../../actions/messages";
import { Message, Category } from "../../types/messages";
import { EmailItem } from "./email-item";
import { Separator } from "@/components/ui/separator";
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
  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getMessages(userId, selectedCategoryId);
      setMessages(data.messages);
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
        <div className="divide-y">
          {messages.length > 0 ? (
            messages.map((message) => (
              <EmailItem key={message.id} message={message} />
            ))
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              No emails yet in this category
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
