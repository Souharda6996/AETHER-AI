import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah Chen",
    role: "CTO, Meridian Labs",
    text: "Aether replaced our entire support team's L1 workflow. Resolution time dropped 73% in the first month.",
    rating: 5,
  },
  {
    name: "Marcus Reid",
    role: "VP Engineering, ScaleForce",
    text: "The architecture is genuinely impressive. 47ms latency at scale isn't marketing—it's real. We tested it.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Head of CX, Nuvola",
    text: "We deployed across 12 channels in a single afternoon. The omnichannel capability is best-in-class.",
    rating: 5,
  },
  {
    name: "James Kowalski",
    role: "Founder, DataStream AI",
    text: "Conversational memory is the killer feature. Aether remembers what our customers said 3 months ago.",
    rating: 5,
  },
  {
    name: "Elena Vasquez",
    role: "Director of Ops, Helios",
    text: "SOC2 compliance out of the box saved us 6 months of security work. Enterprise-ready from day one.",
    rating: 5,
  },
];

const ReviewsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-25%"]);

  return (
    <section id="reviews" ref={containerRef} className="py-32 overflow-hidden relative">
      <div className="container mx-auto px-6 mb-16">
        <motion.div
          className="perspective-container"
          initial={{ opacity: 0, rotateX: 60, y: 60 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          <p className="text-primary font-mono-custom text-sm mb-4 tracking-wider uppercase">
            Testimonials
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground">
            Trusted by <span className="text-gradient">Leaders</span>
          </h2>
        </motion.div>
      </div>

      <motion.div style={{ x }} className="flex gap-6 pl-6">
        {reviews.map((review, i) => (
          <motion.div
            key={review.name}
            className="glass-card p-8 min-w-[350px] max-w-[400px] shrink-0"
            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: "spring", damping: 20, stiffness: 100 }}
            whileHover={{ scale: 1.03, y: -4 }}
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: review.rating }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-foreground text-sm leading-relaxed mb-6">
              "{review.text}"
            </p>
            <div>
              <p className="font-display text-sm text-foreground">{review.name}</p>
              <p className="text-xs text-muted-foreground">{review.role}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ReviewsSection;
