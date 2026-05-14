import type { Metadata } from "next";
import { mockTests } from "@/lib/mock-data";
import TestForm from "@/components/tests/TestForm";
import { notFound } from "next/navigation";
import { getTests, getTestsById } from "@/app/services/testsService";


export const metadata: Metadata = { title: "Edit Test" };

interface EditTestPageProps {
  params: Promise<{ id: string }>;
}

interface Props {
  params: {
    id: number;
  };
}

export default async function EditTestPage({ params }: Props) {
  const test = await getTestsById(Number(params.id));
  /*const { id } = await params;
  const test = mockTests.find((t) => t.id === id);
  if (!test) notFound();
  */
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
