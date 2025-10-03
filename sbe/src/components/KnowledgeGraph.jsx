import { useState, useEffect } from 'react';
import './KnowledgeGraph.css';

export default function KnowledgeGraph({ data }) {
    const [selectedNode, setSelectedNode] = useState(null);

    if (!data || !data.structured) {
        return null;
    }

    const { categories, keyFindings, researchGaps } = data.structured;

    // Create visual connections between categories and findings
    const nodes = [
        ...(categories || []).map((cat, idx) => ({
            id: `cat-${idx}`,
            label: cat,
            type: 'category',
            x: 50 + (idx * 150) % 600,
            y: 100
        })),
        ...(keyFindings || []).slice(0, 5).map((finding, idx) => ({
            id: `finding-${idx}`,
            label: finding.substring(0, 50) + '...',
            type: 'finding',
            x: 100 + (idx * 120) % 500,
            y: 250
        })),
        ...(researchGaps || []).slice(0, 3).map((gap, idx) => ({
            id: `gap-${idx}`,
            label: gap.substring(0, 50) + '...',
            type: 'gap',
            x: 150 + (idx * 200) % 400,
            y: 400
        }))
    ];

    return (
        <div className="knowledge-graph-container">
            <h3>🕸️ Knowledge Graph Visualization</h3>
            <div className="graph-canvas">
                <svg width="100%" height="500" viewBox="0 0 800 500">
                    {/* Draw connections */}
                    {nodes.filter(n => n.type === 'category').map((catNode, idx) => 
                        nodes.filter(n => n.type === 'finding').map((findingNode, fidx) => (
                            <line
                                key={`conn-${idx}-${fidx}`}
                                x1={catNode.x}
                                y1={catNode.y}
                                x2={findingNode.x}
                                y2={findingNode.y}
                                stroke="#e0e0e0"
                                strokeWidth="1"
                                opacity="0.3"
                            />
                        ))
                    )}

                    {/* Draw nodes */}
                    {nodes.map((node, idx) => (
                        <g key={node.id} onClick={() => setSelectedNode(node)}>
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={node.type === 'category' ? 40 : node.type === 'finding' ? 30 : 25}
                                fill={
                                    node.type === 'category' ? '#667eea' :
                                    node.type === 'finding' ? '#4caf50' :
                                    '#ff9800'
                                }
                                opacity="0.8"
                                className="graph-node"
                            />
                            <text
                                x={node.x}
                                y={node.y + 5}
                                textAnchor="middle"
                                fill="white"
                                fontSize="10"
                                fontWeight="bold"
                            >
                                {node.type === 'category' ? '📚' : 
                                 node.type === 'finding' ? '💡' : '🎯'}
                            </text>
                        </g>
                    ))}
                </svg>

                {selectedNode && (
                    <div className="node-details">
                        <button onClick={() => setSelectedNode(null)} className="close-btn">✕</button>
                        <h4>
                            {selectedNode.type === 'category' ? '📚 Category' :
                             selectedNode.type === 'finding' ? '💡 Finding' : '🎯 Research Gap'}
                        </h4>
                        <p>{selectedNode.label}</p>
                    </div>
                )}
            </div>

            <div className="graph-legend">
                <div className="legend-item">
                    <span className="legend-color category"></span>
                    <span>Categories</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color finding"></span>
                    <span>Key Findings</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color gap"></span>
                    <span>Research Gaps</span>
                </div>
            </div>
        </div>
    );
}
