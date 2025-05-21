import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

interface SchemaTreeViewProps {
  schema: Record<string, any>;
  selectedPath: string[];
}

// Динамический импорт, чтобы избежать SSR проблем с react-d3-tree
const Tree = dynamic(() => import('react-d3-tree').then((mod) => mod.Tree), { ssr: false });

function buildTree(schema: any, path: string[]): any {
  if (!path.length) return null;
  // Рекурсивно строим всё дерево от первого выбранного уровня
  function buildNode(name: string, value: any, depth: number): any {
    const children =
      value && typeof value === 'object' ? Object.keys(value).map((key) => buildNode(key, value[key], depth + 1)) : [];
    return { name, pathIndex: depth, children };
  }
  return buildNode(path[0], schema[path[0]], 0);
}

const renderLabel =
  (selectedPath: string[]) =>
  ({ nodeDatum }: any) => {
    // Подсвечиваем только если имя и индекс совпадают с selectedPath
    const isPath =
      typeof nodeDatum.pathIndex === 'number' &&
      nodeDatum.pathIndex < selectedPath.length &&
      nodeDatum.name === selectedPath[nodeDatum.pathIndex];
    return (
      <foreignObject
        width={100}
        height={100}
        x={-50}
        y={-14}>
        <div
          style={{
            width: 90,
            fontSize: 11,
            fontWeight: isPath ? 700 : 400,
            color: '#222',
            textAlign: 'center',
            wordBreak: 'break-word',
            whiteSpace: 'pre-line',
            background: isPath ? '#e0e7ff' : 'white',
            borderRadius: 6,
            padding: '1px 4px',
            boxShadow: isPath ? '0 0 0 1.5px #2563eb' : 'none',
            border: isPath ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
            display: 'inline-block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
          {nodeDatum.name}
        </div>
      </foreignObject>
    );
  };

const SchemaTreeView: React.FC<SchemaTreeViewProps> = ({ schema, selectedPath }) => {
  const treeData = useMemo(() => buildTree(schema, selectedPath), [schema, selectedPath]);
  if (!selectedPath || selectedPath.length === 0 || !treeData) return null;
  return (
    <div className="w-full h-full bg-white rounded-lg shadow p-2 flex items-center justify-center">
      <Tree
        data={treeData}
        orientation="vertical"
        translate={{ x: 650, y: 40 }}
        zoomable={false}
        collapsible={false}
        separation={{ siblings: 1.2, nonSiblings: 1.5 }}
        nodeSize={{ x: 90, y: 80 }}
        renderCustomNodeElement={renderLabel(selectedPath)}
        pathFunc="elbow"
      />
    </div>
  );
};

export default SchemaTreeView;
