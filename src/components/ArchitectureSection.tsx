import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Cpu, Cloud, Lock, Workflow, Globe } from "lucide-react";

const nodes = [
  { id: "input", label: "Input Layer", icon: Globe, description: "Multi-channel ingestion: REST, WebSocket, gRPC", x: 10, y: 20, connections: ["llm"] },
  { id: "llm", label: "LLM Core", icon: Cpu, description: "Transformer-based reasoning with 128K context window", x: 40, y: 15, connections: ["memory", "tools"] },
  { id: "memory", label: "Memory Store", icon: Database, description: "Vector DB with semantic search & conversation history", x: 70, y: 20, connections: ["output"] },
  { id: "tools", label: "Tool Orchestrator", icon: Workflow, description: "Autonomous tool selection & execution pipeline", x: 40, y: 55, connections: ["security"] },
  { id: "security", label: "Security Mesh", icon: Lock, description: "Zero-trust validation on every inference step", x: 70, y: 55, connections: ["output"] },
  { id: "output", label: "Edge Delivery", icon: Cloud, description: "Global CDN with 47ms P95 latency", x: 85, y: 38 },
];

const ArchitectureSection = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const getConnectedNodes = (nodeId: string): string[] => {
    const connected: string[] = [nodeId];
    nodes.forEach((n) => {
      if (n.id === nodeId && n.connections) connected.push(...n.connections);
      if (n.connections?.includes(nodeId)) connected.push(n.id);
    });
    return connected;
  };

  const highlightedNodes = activeNode ? getConnectedNodes(activeNode) : [];

  return (
    <section id="architecture" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-20 perspective-container"
          initial={{ opacity: 0, rotateX: 60, y: 60 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          <p className="text-primary font-mono-custom text-sm mb-4 tracking-wider uppercase">
            System Architecture
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground">
            The <span className="text-gradient">Neural Stack</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Low-latency inference at the edge. Six modular layers, zero single points of failure.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {nodes.map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, rotateX: 45, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", damping: 20, stiffness: 100 }}
              className="perspective-container"
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
            >
              <motion.div
                className={`glass-card p-6 h-full cursor-pointer transition-all duration-300 ${
                  activeNode && !highlightedNodes.includes(node.id) ? "opacity-30" : ""
                } ${activeNode === node.id ? "ring-1 ring-primary/50" : ""}`}
                whileHover={{ scale: 1.03, y: -4 }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
                      highlightedNodes.includes(node.id) && activeNode
                        ? "bg-primary/20"
                        : "bg-secondary"
                    }`}
                  >
                    <node.icon
                      className={`h-5 w-5 transition-colors duration-300 ${
                        highlightedNodes.includes(node.id) && activeNode
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-base text-foreground">{node.label}</h3>
                    <p className="text-muted-foreground text-sm mt-1 font-mono-custom text-xs leading-relaxed">
                      {node.description}
                    </p>
                  </div>
                </div>
                {node.connections && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {node.connections.map((c) => (
                      <span key={c} className="text-xs font-mono-custom px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                        → {nodes.find((n) => n.id === c)?.label}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
