import type { Metadata } from "next";
import TestForm from "@/components/tests/TestForm";

export const metadata: Metadata = { title: "Create Test" };

export default function NewTestPage() {
  return <TestForm mode="create" />;
}
