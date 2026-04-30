import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPostByIdAdmin } from "@/app/admin/_actions/posts";
import { PostEditorForm } from "@/components/admin/post-editor-form";

export const metadata: Metadata = {
  title: "Admin · Edit post",
};

type Props = { params: Promise<{ id: string }> };

export default async function EditAdminPostPage({ params }: Props) {
  const { id } = await params;

  const post = await getPostByIdAdmin(id);
  if (!post) notFound();

  return <PostEditorForm mode="edit" post={post} />;
}
