"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Category,
  CategorySettings,
  CategorySettingsItem,
} from "../../types/messages";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getCategorySettings,
  saveCategorySettings,
} from "../../actions/categories";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

type Props = {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  userId: string;
};

export default function CategorySettingsModal(props: Props) {
  const [settings, setSettings] = useState<CategorySettings | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async (values: CategorySettings | null) => {
    if (!values) {
      return;
    }
    console.log(values);
    setLoading(true);
    const data = await saveCategorySettings(
      props.category!.id,
      values,
      props.userId
    );
    setSettings(data.settings);
    setLoading(false);
    props.onClose();
  };

  useEffect(() => {
    const handleGetSettings = async () => {
      try {
        if (!props.category) {
          return;
        }
        setLoading(true);
        const data = await getCategorySettings(
          props.category!.id,
          props.userId
        );
        if (data) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (props.isOpen) {
      handleGetSettings();
    }
  }, [props.isOpen, props.category, props.userId]);

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose} modal>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] overflow-y-auto max-h-[90vh] min-h-[300px]">
        <DialogHeader>
          <DialogTitle>{props.category?.name}</DialogTitle>
          <DialogDescription>{props.category?.definition}</DialogDescription>
        </DialogHeader>
        <SettingsContent
          settings={settings}
          loading={loading}
          onSave={handleSaveSettings}
        />
      </DialogContent>
    </Dialog>
  );
}

function SettingsContent(props: {
  settings: CategorySettings | null;
  loading: boolean;
  onSave: (values: CategorySettings | null) => Promise<void>;
}) {
  const [settings, setSettings] = useState<CategorySettings | null>(
    props.settings
  );
  const onCheckboxChange = (item: CategorySettingsItem, checked: boolean) => {
    setSettings({
      ...settings,
      items:
        settings?.items.map((i) => {
          if (i.id === item.id && i.key === item.key) {
            return { ...i, value: { ...i.value, value: checked } };
          }
          return i;
        }) ?? [],
    });
  };
  if (props.loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }
  if (!settings) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Separator className="my-4" />
        <p className="text-muted-foreground text-sm">
          No settings could be retrieved. Check your connection and try again.
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col gap-2">
        <Separator className="my-2" />
        <h2 className="text-md font-semibold">Settings for this category</h2>
        <p className="text-xs text-muted-foreground mb-4">
          These settings will be applied to all emails in this category.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {settings.items.map((item) => (
            <div className="flex flex-col gap-2" key={item.id}>
              {item.value.type === "boolean" ? (
                <BooleanSetting
                  item={item}
                  onCheckboxChange={onCheckboxChange}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <DialogFooter>
        <Button
          disabled={props.loading || !settings}
          onClick={() => props.onSave(settings)}
        >
          Save
        </Button>
      </DialogFooter>
    </>
  );
}

function BooleanSetting({
  item,
  onCheckboxChange,
}: {
  item: CategorySettingsItem;
  onCheckboxChange: (item: CategorySettingsItem, checked: boolean) => void;
}) {
  return (
    <div className="flex gap-2 items-center cursor-pointer">
      <Checkbox
        id={`${item.id}-checkbox`}
        checked={item.value.value}
        onCheckedChange={(checked) => {
          onCheckboxChange(item, checked as boolean);
        }}
      />
      <label
        htmlFor={`${item.id}-checkbox`}
        className="text-sm font-medium cursor-pointer"
      >
        {PrettySettingName(item.key)}
      </label>
    </div>
  );
}

function PrettySettingName(name: string) {
  return name.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
