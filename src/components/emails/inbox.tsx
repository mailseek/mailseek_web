"use client";

import { Dispatch, SetStateAction, Suspense, useEffect, useState } from "react";
import { getMessages, unsubscribeFromEmails, deleteMessages } from "../../actions/messages";
import { Message, Category } from "../../types/messages";
import { EmailItem } from "./email-item";
import { Separator } from "@/components/ui/separator";
import { BellOff, Loader2, Mail, Trash } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
  userId: string;
  selectedCategoryId: string | null;
  categories: Category[];
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
};

export default function Inbox({
  userId,
  selectedCategoryId,
  categories,
  messages,
  setMessages,
}: Props) {
  const [category, setCategory] = useState<Category | null>(
    categories.find((cat) => cat.id === selectedCategoryId) || null
  );
  const [loading, setLoading] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  const handleUnsubscribeFromEmails = async () => {
    if (selectedMessages.length === 0) {
      return;
    }
    console.log('Unsubscribing from emails', selectedMessages);
    const data = await unsubscribeFromEmails(selectedMessages, userId);
    const ids = data.messages.map((message) => message.message_id);
    setSelectedMessages([]);
    setMessages((prev) => {
      return prev.map((message) => {
        if (ids.includes(message.message_id)) {
          return {
            ...message,
            status: 'unsubscribing',
          }
        }
        return message;
      })
    });
  };

  const handleDeleteMessages = async () => {
    if (selectedMessages.length === 0) {
      return;
    }
    console.log('Deleting messages', selectedMessages);
    const data = await deleteMessages(selectedMessages, userId);
    const ids = data.messages.map((message) => message.message_id);
    setSelectedMessages([]);
    setMessages((prev) => {
      return prev.map((message) => {
        if (ids.includes(message.message_id)) {
          return {
            ...message,
            status: 'deleted',
          }
        }
        return message;
      })
    });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!selectedCategoryId) {
          return;
        }
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
    setCategory(
      categories.find((cat) => cat.id === selectedCategoryId) || null
    );
  }, [categories, selectedCategoryId]);

  if (!selectedCategoryId) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        Choose a category to see emails
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {category?.name || "Emails"}
          </h1>
          <p className="text-muted-foreground">
            {category?.definition ||
              "Browse and manage your emails by category"}
          </p>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="flex items-center gap-2 justify-end">
        <Button
          variant="destructive"
          size="sm"
          disabled={selectedMessages.length === 0}
          onClick={() => {
            handleDeleteMessages();
          }}
        >
          <Trash className="w-4 h-4" />
          Delete
        </Button>
        <Button variant="outline" size="sm" disabled={selectedMessages.length === 0} onClick={() => {
          handleUnsubscribeFromEmails();
        }}>
          <BellOff className="w-4 h-4" />
          Unsubscribe
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Suspense fallback={<Fallback loading={loading} />}>
          <div className="divide-y">
            {messages.length > 0 ? (
              messages.map((message) => (
                <EmailItem
                  key={message.id}
                  message={message}
                  selected={selectedMessages.includes(message.message_id)}
                  onSelect={(messageId) => {
                    setSelectedMessages((prev) =>
                      prev.includes(messageId)
                        ? prev.filter((id) => id !== messageId)
                        : [...prev, messageId]
                    );
                  }}
                />
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
