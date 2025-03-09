"use client";
import React, { Suspense, useEffect, useState } from "react";
import socket from "../socket";
import { Channel } from "phoenix";
import { logRealtime } from "../lib/utils";
import { BarChart3, Mail, Plus } from "lucide-react";
import { Button } from "./ui/button";
import GoogleAuth from "./google_auth";
import { Separator } from "./ui/separator";
import Inbox from "./emails/inbox";
import { ScrollArea } from "./ui/scroll-area";
import { CategoryList } from "./emails/category-list";
import { Category, Message } from "../types/messages";
import AddCategoryModal from "./add-category-modal";
import { MailseekUser } from "../types/users";
import { ConnectedAccountsList } from "./emails/connected-accounts-list";
import Link from "next/link";

type Props = {
  socketToken: string;
  user: {
    id: string;
    email: string;
  };
  categories: Category[];
  connectedAccounts: MailseekUser[];
};

export default function Emails({
  socketToken,
  user,
  categories: initialCategories,
  connectedAccounts,
}: Props) {
  const [isConnected, setIsConnected] = useState(false);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    const name = `emails:all`;
    if (!socket) {
      console.error("Socket not provided");
      return;
    }
    const ch = socket.channel(name, {
      token: socketToken,
    });
    ch.onError((error) => {
      setIsConnected(false);
      setChannel(null);
      logRealtime("Error joining channel", { name, error });
    });
    ch.onClose(() => {
      logRealtime("Channel closed");
      setChannel(null);
      setIsConnected(false);
    });
    ch.join()
      .receive("ok", (resp: { categories: string[] }) => {
        setIsConnected(true);
        setChannel(ch);
        logRealtime("Joined channel", { name, resp });
      })
      .receive("error", (resp) => {
        setIsConnected(false);
        setChannel(null);
        logRealtime("Failed to join channel", { name, resp });
      });
    return () => {
      ch.leave();
    };
  }, []);
  useEffect(() => {
    if (channel) {
      channel.off("email_processed");
      channel.off("email_updated");

      channel.on(
        "email_processed",
        (resp: { user_id: string; payload: { message: Message } }) => {
          if (
            resp.payload.message.category_id &&
            resp.payload.message.category_id === selectedCategoryId
          ) {
            setMessages((prev) => {
              const ids = prev.map((message) => message.message_id);
              if (ids.includes(resp.payload.message.message_id)) {
                return prev.map((message) => {
                  if (message.message_id === resp.payload.message.message_id) {
                    return {
                      ...message,
                      ...resp.payload.message,
                    };
                  }
                  return message;
                });
              }
              return [resp.payload.message, ...prev];
            });
          }
        }
      );
      channel.on(
        "email_updated",
        (resp: { user_id: string; payload: { message: Message } }) => {
          if (resp.payload.message.status === "processed") {
            return;
          }
          setMessages((prev) => {
            return prev.map((message) => {
              if (message.message_id === resp.payload.message.message_id) {
                return {
                  ...message,
                  ...resp.payload.message,
                };
              }
              return message;
            });
          });
        }
      );
    }
  }, [channel, selectedCategoryId]);
  return (
    <div className="flex min-h-screen flex-col">
      <header className="p-2 md:p-0 sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold hidden md:block">Mailseek</span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <p>{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <GoogleAuth
              title="Add account"
              redirectTo={`${process.env.NEXT_PUBLIC_URL}/auth/connect/${user.id}?next=/mail`}
            />
          </div>
        </div>
      </header>
      <div className="p-2 md:p-0 container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="md:fixed top-16 z-30 md:-ml-2 md:h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block">
          <ScrollArea className="h-full py-6 md:pr-6">
            <div className="flex flex-col gap-4">
              <Button
                className="w-full justify-start gap-2"
                onClick={() => {
                  setIsAddCategoryModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                New Category
              </Button>
              <AddCategoryModal
                userId={user.id}
                onClose={() => setIsAddCategoryModalOpen(false)}
                isOpen={isAddCategoryModalOpen}
                onSubmit={(cats) => {
                  setCategories(cats);
                  setIsAddCategoryModalOpen(false);
                }}
              />

              <Separator className="my-2" />

              <CategoryList
                categories={categories}
                selectedCategory={selectedCategoryId}
                onSelectCategory={(catId) => {
                  setSelectedCategoryId(catId);
                }}
              />

              <Separator className="my-2" />

              <ConnectedAccountsList connectedAccounts={connectedAccounts} />
              <Separator className="my-2" />

              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                asChild
              >
                <Link href="/reports" className="w-full justify-start gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Reports & screenshots
                </Link>
              </Button>
            </div>
          </ScrollArea>
        </aside>
        <main className="mt-4 flex w-full flex-col overflow-hidden">
          <Inbox
            messages={messages}
            setMessages={setMessages}
            userId={user.id}
            selectedCategoryId={selectedCategoryId}
            categories={categories}
          />
        </main>
      </div>
    </div>
  );
}
