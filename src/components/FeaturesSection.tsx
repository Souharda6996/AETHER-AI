import { motion } from "framer-motion";
import { Brain, Zap, Shield, Globe, MessageSquare, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Autonomous Reasoning",
    description: "Multi-step reasoning chains that handle complex queries without human intervention. Context-aware and self-correcting.",
  },
  {
    icon: Zap,
    title: "Edge Inference",
    description: "Low-latency inference at the edge. 47ms response time globally with our distributed inference mesh.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC2 Type II certified. End-to-end encryption, RBAC, and audit logging built into every interaction.",
  },
  {
    icon: Globe,
    title: "Omnichannel Deploy",
    description: "Deploy once, run everywhere. Web, mobile, Slack, Teams, WhatsApp—all from a single configuration.",
  },
  {
    icon: MessageSquare,
    title: "Conversational Memory",
    description: "Persistent memory across sessions. Aether remembers context, preferences, and past interactions.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Live dashboards tracking resolution rates, sentiment scores, and customer satisfaction in real time.",
  },
];

const cardVariants = {
  initial: { opacity: 0, rotateX: 45, y: 60, scale: 0.9 },
  whileInView: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 20, stiffness: 100 },
  },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-20 perspective-container"
          initial={{ opacity: 0, rotateX: 60, y: 60 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground">
            Built for <span className="text-gradient">Scale</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Every component engineered for enterprise-grade performance. No compromises.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className="perspective-container"
            >
              <motion.div
                className="glass-card p-8 h-full group cursor-default"
                whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2 } }}
              >
                <div className="glass-card-inner">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5"
                    whileHover={{ rotate: 10 }}
                  >
                    <feature.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h3 className="font-display text-xl text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
