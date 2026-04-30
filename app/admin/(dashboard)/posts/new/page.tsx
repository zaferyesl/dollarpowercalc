import type { Metadata } from "next";

import { PostEditorForm } from "@/components/admin/post-editor-form";

export const metadata: Metadata = {
  title: "Admin · New post",
};

export default function NewAdminPostPage() {
  return <PostEditorForm mode="create" />;
}
