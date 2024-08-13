"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { generatePRD } from "@/app/actions/generatePRDAction";
import { readStreamableValue } from "ai/rsc";

export const maxDuration = 300; // Allow streaming responses up to 5 minutes

export default function PRDGenerator({ projectId }: { projectId: string }) {
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState<number>(0);

  const handleGeneratePRD = async () => {
    setIsGenerating(true);
    setGeneratedContent("");
    setError(null);
    try {
      const { output, version } = await generatePRD(projectId);
      for await (const delta of readStreamableValue(output)) {
        setGeneratedContent((currentContent) => `${currentContent}${delta}`);
      }
      setVersion(version);
    } catch (error) {
      console.error("Error generating PRD:", error);
      setError(
        `An error occurred while generating the PRD: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    handleGeneratePRD();
  }, [projectId]);

  return (
    <div id="train-model-container" className="w-full h-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Generate PRD</h1>
        <Button onClick={handleGeneratePRD} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Regenerate PRD"}
        </Button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {generatedContent && (
          <div>
            <h2 className="text-xl font-semibold mt-4">
              Generated PRD (Version {version})
            </h2>
            <pre className="mt-2 p-4 bg-gray-100 rounded-md overflow-auto whitespace-pre-wrap">
              {generatedContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
