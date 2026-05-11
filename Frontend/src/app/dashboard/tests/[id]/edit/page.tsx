import type { Metadata } from "next";
import { mockTests } from "@/lib/mock-data";
import TestForm from "@/components/tests/TestForm";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Edit Test" };

interface EditTestPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTestPage({ params }: EditTestPageProps) {
  const { id } = await params;
  const test = mockTests.find((t) => t.id === id);
  if (!test) notFound();

  return (
    <TestForm
      mode="edit"
      initialValues={{
        name: test.name,
        url: test.url,
        method: test.method,
        headers: test.headers.length > 0 ? test.headers : [{ key: "", value: "" }],
        body: test.body,
        expectedStatusCode: test.expectedStatusCode,
        maxResponseTime: test.maxResponseTime,
      }}
    />
  );
}
