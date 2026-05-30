// Maps the string icon names used in nav.config.js to lucide-react components,
// keeping the config plain-data (serializable, no JSX).
import {
  Home,
  FileText,
  Image as ImageIcon,
  PenSquare,
  Target,
  MessageSquareQuote,
  Heart,
  Inbox,
  Mail,
  Handshake,
  Settings,
} from "lucide-react";

export const navIcons = {
  home: Home,
  file: FileText,
  image: ImageIcon,
  edit: PenSquare,
  target: Target,
  chat: MessageSquareQuote,
  heart: Heart,
  inbox: Inbox,
  mail: Mail,
  handshake: Handshake,
  settings: Settings,
};
