"use client";

import { galleryPage } from "@/features/admin/config/pages.config";
import { useGalleryPageDocument } from "@/features/admin/data/useGalleryPageDocument";
import { PageOverviewEditor } from "@/components/admin/shell/PageOverviewEditor";

export default function GalleryPageEditor() {
  const content = useGalleryPageDocument();
  return <PageOverviewEditor pageConfig={galleryPage} content={content} />;
}
