"use client";
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function Features() {
  const features = [
    {
      title: "AI-Powered Predictions",
      description:
        "Get quick stroke risk estimates using advanced machine learning models.",
      icon: "🧠",
    },
    {
      title: "Private & Secure",
      description:
        "Your data is never stored without your consent. Predictions are generated in real-time.",
      icon: "🔒",
    },
    {
      title: "Instant Results",
      description:
        "Get your stroke risk level within seconds after submitting your information.",
      icon: "⚡",
    },
    {
      title: "Mobile Friendly",
      description:
        "Fully responsive design for seamless use on phones, tablets, and desktops.",
      icon: "📱",
    },
    {
      title: "Secure User Authentication",
      description:
        "Securely access your account with encrypted login to protect your personal health data.",
      icon: "🧾",
    },
    {
      title: "Prediction History Tracking",
      description:
        "Easily access and review your previous predictions to monitor your health over time.",
      icon: "📊",
    },
    
  ];

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-36 mx-auto flex flex-col items-center gap-10 pb-3 from-bg-background/30 to-overlay-2/30 bg-linear-to-br">
      <h2 className="bg-secondary/80 text-white px-3 py-4 rounded-b-3xl text-2xl font-semibold shadow-sm tracking-wid text-center">
        Key Features
      </h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature: any, index: number) => (
          <div key={index} className="bg-background p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-primary text-4xl mb-4">{feature?.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature?.title}</h3>
            <p className="text-muted-foreground">{feature?.description}</p>
          </div>
        ))}
      </div>
      <div className="w-full max-w-4xl bg-overlay-2/50 border border-muted rounded-lg py-4 px-2 md:p-6 shadow-md flex flex-col md:flex-row
       justify-center items-center gap-2 my-10">
        <div className="text-lg md:text-xl">⚠️</div>
        <p className="text-center text-foreground italic md:p-2">
           This tool is designed to raise stroke awareness — not a replacement for medical advice.
        </p>
      </div>
    </div>
  );
}
