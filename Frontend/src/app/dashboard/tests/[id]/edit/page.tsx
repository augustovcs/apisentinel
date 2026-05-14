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
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTestPage({ params }: Props) {

  const { id } = await params;
  const test = await getTestsById(Number(id));
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

        headers:
          Object.entries(test.headers).map(([key, value]) => ({
            key,
            value: String(value),
          })),

        body:
          typeof test.body === "string"
            ? test.body
            : JSON.stringify(test.body, null, 2),

        expectedStatusCode: test.expectedStatusCode,
        maxResponseTime: test.maxResponseTime,
      }}
    />
  );
}
