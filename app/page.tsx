'use client';
import { useState } from 'react';

import schema from './json-schema.json';

import SchemaPathSelector from './schemaPathSelector';
import SchemaTreeView from './SchemaTreeView';

export default function Home() {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] w-full items-stretch justify-stretch">
      <main className="flex flex-col gap-[32px] row-start-2 w-full items-stretch">
        <SchemaPathSelector
          schema={schema}
          selectedPath={selectedPath}
          setSelectedPath={setSelectedPath}
        />
        <SchemaTreeView
          schema={schema}
          selectedPath={selectedPath}
        />
      </main>
    </div>
  );
}
