"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MailseekUser } from "@/types/users"
interface ConnectedAccountsListProps {
  connectedAccounts: MailseekUser[]
}

export function ConnectedAccountsList({ connectedAccounts }: ConnectedAccountsListProps) {
  return (
    <div className="space-y-1">
      <h3 className="px-2 text-sm font-medium">Connected Accounts</h3>
      <div className="space-y-1">
        {connectedAccounts.map((account) => (
          <Button
            key={account.id}
            variant="ghost"
            size="sm"
            disabled
            className={cn("w-full justify-start gap-2")}
          >
            <span className="flex-1 text-left">{account.email}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
