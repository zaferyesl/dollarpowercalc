"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { deletePost } from "@/app/admin/_actions/posts";
import { Button } from "@/components/ui/button";

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={pending}
      className="bg-destructive/15 text-destructive hover:bg-destructive/25"
      onClick={() => {
        if (!confirm(`Permanently delete “${title}”?`)) return;
        start(async () => {
          await deletePost(id);
          router.refresh();
        });
      }}
    >
      Delete
    </Button>
  );
}
