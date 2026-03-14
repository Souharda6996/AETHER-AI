import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 49,
    yearlyPrice: 39,
    description: "For early-stage teams testing AI-first support.",
    features: ["1,000 conversations/mo", "3 channels", "Basic analytics", "Email support", "5 team seats"],
    highlighted: false,
  },
  {
    name: "Pro",
    monthlyPrice: 199,
    yearlyPrice: 159,
    description: "For scaling teams that need full autonomy.",
    features: ["25,000 conversations/mo", "Unlimited channels", "Advanced analytics", "Priority support", "Unlimited seats", "Custom training", "API access"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    description: "For organizations with custom infrastructure needs.",
    features: ["Unlimited conversations", "Dedicated infrastructure", "Custom SLA", "24/7 phone support", "SSO & SAML", "On-prem deployment", "Custom integrations"],
    highlighted: false,
  },
];

const PricingSection = () => {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16 perspective-container"
          initial={{ opacity: 0, rotateX: 60, y: 60 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          <p className="text-primary font-mono-custom text-sm mb-4 tracking-wider uppercase">
            Pricing
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground">
            Simple, <span className="text-gradient">Transparent</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No hidden fees. Scale when you're ready.
          </p>

          {/* Toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`text-sm ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <motion.button
              className="relative w-14 h-7 rounded-full bg-secondary p-1"
              onClick={() => setYearly(!yearly)}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-primary"
                animate={{ x: yearly ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.button>
            <span className={`text-sm ${yearly ? "text-foreground" : "text-muted-foreground"}`}>
              Yearly <span className="text-primary text-xs">Save 20%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, rotateX: 45, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring", damping: 20, stiffness: 100 }}
              className="perspective-container"
            >
              <motion.div
                className={`glass-card p-8 h-full relative ${
                  plan.highlighted ? "gradient-border" : ""
                }`}
                whileHover={{ scale: 1.02, y: -6 }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-2xl text-foreground">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mt-2">{plan.description}</p>

                <div className="mt-6 mb-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={yearly ? "yearly" : "monthly"}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {plan.monthlyPrice ? (
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-5xl text-foreground">
                            ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                          </span>
                          <span className="text-muted-foreground text-sm">/mo</span>
                        </div>
                      ) : (
                        <span className="font-display text-3xl text-foreground">Custom</span>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <motion.button
                  className={`w-full rounded-lg py-3 text-sm font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-muted"
                  }`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.monthlyPrice ? "Get Started" : "Contact Sales"}
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
