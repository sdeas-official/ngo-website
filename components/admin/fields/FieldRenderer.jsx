"use client";

import { TextField } from "@/components/admin/fields/TextField";
import { TextArea } from "@/components/admin/fields/TextArea";
import { ImageField } from "@/components/admin/fields/ImageField";
import { YouTubeField } from "@/components/admin/fields/YouTubeField";
import { ToggleField } from "@/components/admin/fields/ToggleField";
import { StringListField } from "@/components/admin/fields/StringListField";
import { ImageListField } from "@/components/admin/fields/ImageListField";
import { ValuesList } from "@/components/admin/fields/ValuesList";

// Maps a single field config (from the *.config.js schemas) to its primitive.
// This dispatcher is the heart of the schema-driven forms: adding a content type
// means writing a config, not new JSX.
export function FieldRenderer({ field, value, onChange, error }) {
  const common = { label: field.label, value, onChange, error, required: field.required };

  switch (field.type) {
    case "textarea":
      return <TextArea {...common} big={field.big} placeholder={field.placeholder} />;
    case "image":
      return <ImageField {...common} />;
    case "youtube":
      return <YouTubeField {...common} />;
    case "toggle":
      return (
        <ToggleField
          label={field.label}
          description={field.description}
          value={Boolean(value)}
          onChange={onChange}
        />
      );
    case "stringList":
      return <StringListField {...common} placeholderPrefix={field.itemLabel || "Item"} />;
    case "imageList":
      return <ImageListField label={field.label} value={value} onChange={onChange} />;
    case "valuesList":
      return <ValuesList label={field.label} value={value} onChange={onChange} />;
    case "number":
      return <TextField {...common} type="number" min={field.min ?? 1} step={field.step ?? 1} placeholder={field.placeholder} />;
    case "datetime":
      return <TextField {...common} type="datetime" />;
    case "url":
      return <TextField {...common} type="url" placeholder={field.placeholder || "https://..."} />;
    case "tag":
      return <TextField {...common} type="text" placeholder="Enter exact tag enum value" help={field.help} />;
    case "text":
    default:
      return <TextField {...common} type="text" placeholder={field.placeholder} help={field.help} />;
  }
}
