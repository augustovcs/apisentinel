import type { Metadata } from "next";
import TestsClient from "@/components/tests/TestsClient";

export const metadata: Metadata = { title: "Tests" };

export default function TestsPage() {
  return <TestsClient />;
}
