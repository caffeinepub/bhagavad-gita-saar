import { Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import InstallButton from "../components/InstallButton";
import { useAuth } from "../hooks/useAuth";

const CHAPTERS = [
  {
    num: 1,
    title: "अर्जुन विषाद योग",
    points: [
      "जीवन में संकट आने पर मन विचलित हो जाता है।",
      "कर्तव्य और भावनाओं के बीच द्वंद्व स्वाभाविक है।",
      "युद्ध से पहले शक्ति और कमजोरी का आकलन जरूरी है।",
      "संदेह और भय हमें निर्णय लेने से रोकते हैं।",
      "गुरु की शरण में जाना समाधान का पहला कदम है।",
    ],
  },
  {
    num: 2,
    title: "सांख्य योग",
    points: [
      "आत्मा अमर है, शरीर नश्वर; इस सत्य को समझो।",
      "कर्म करो, फल की चिंता मत करो।",
      "सुख-दुख समान भाव से स्वीकार करो।",
      "स्थिर बुद्धि वाला व्यक्ति संकट में नहीं डगमगाता।",
      "योग में स्थित होकर जीवन को संतुलित करो।",
    ],
  },
  {
    num: 3,
    title: "कर्म योग",
    points: [
      "कर्म करना प्रकृति का नियम है, इससे बचना असंभव है।",
      "निष्काम कर्म से जीवन को पवित्र बनाओ।",
      "दूसरों के लिए प्रेरणा बनने वाला आचरण करो।",
      "स्वार्थ त्यागकर समाज के लिए कार्य करो।",
      "कर्तव्य का पालन ही सच्चा धर्म है।",
    ],
  },
  {
    num: 4,
    title: "ज्ञान कर्म संन्यास योग",
    points: [
      "ज्ञान से कर्म के बंधन कटते हैं।",
      "यज्ञ भाव से किए गए कर्म मुक्ति देते हैं।",
      "जो कर्म को अकर्म और अकर्म को कर्म देखता है, वही बुद्धिमान है।",
      "ईश्वर हर युग में धर्म की रक्षा के लिए अवतार लेता है।",
      "ज्ञान और कर्म का संयोग सफलता की कुंजी है।",
    ],
  },
  {
    num: 5,
    title: "कर्म संन्यास योग",
    points: [
      "संन्यास और कर्म योग दोनों मुक्ति के मार्ग हैं।",
      "जो सुख-दुख को एक समान देखता है, वह मुक्त है।",
      "आत्मा को जानने वाला व्यक्ति अहंकार से मुक्त होता है।",
      "शांति मन की स्थिरता से मिलती है।",
      "ईश्वर पर ध्यान लगाने से चेतना शुद्ध होती है।",
    ],
  },
  {
    num: 6,
    title: "ध्यान योग",
    points: [
      "मन को नियंत्रित करना सबसे बड़ी साधना है।",
      "ध्यान से आत्मा और परमात्मा का मिलन होता है।",
      "संयम और अभ्यास से सफलता मिलती है।",
      "योगी सभी प्राणियों में समानता देखता है।",
      "नियमित साधना से जीवन में संतुलन आता है।",
    ],
  },
  {
    num: 7,
    title: "ज्ञान विज्ञान योग",
    points: [
      "ईश्वर प्रकृति और पुरुष का संयोजन है।",
      "भक्ति से ईश्वर को जाना जा सकता है।",
      "माया से पार पाना ज्ञान से संभव है।",
      "सच्चा भक्त ईश्वर में लीन हो जाता है।",
      "संसार ईश्वर की शक्ति का प्रकटीकरण है।",
    ],
  },
  {
    num: 8,
    title: "अक्षर ब्रह्म योग",
    points: [
      "मृत्यु के समय ईश्वर का स्मरण मुक्ति देता है।",
      "जीवन और मृत्यु का चक्र समझो।",
      "परमात्मा अक्षर और अविनाशी है।",
      "योग से चेतना को उच्च स्तर पर ले जाओ।",
      "भक्ति और समर्पण से ईश्वर प्राप्त होता है।",
    ],
  },
  {
    num: 9,
    title: "राज विद्या राज गुह्य योग",
    points: [
      "ईश्वर की भक्ति सबसे श्रेष्ठ मार्ग है।",
      "संसार ईश्वर का खेल है, उसे समझो।",
      "जो ईश्वर को शरण लेता है, वह दुख से मुक्त होता है।",
      "निष्कपट भक्ति से ईश्वर प्रसन्न होता है।",
      "सभी धर्म ईश्वर की ओर ले जाते हैं।",
    ],
  },
  {
    num: 10,
    title: "विभूति योग",
    points: [
      "ईश्वर सभी शक्तियों और गुणों का स्रोत है।",
      "प्रकृति में ईश्वर की महिमा दिखती है।",
      "भक्त ईश्वर की विभूतियों को पहचानता है।",
      "ईश्वर अनंत रूपों में विद्यमान है।",
      "भक्ति से ईश्वर का दर्शन संभव है।",
    ],
  },
  {
    num: 11,
    title: "विश्वरूप दर्शन योग",
    points: [
      "ईश्वर का विश्वरूप भय और विस्मय उत्पन्न करता है।",
      "सच्चा भक्त ही ईश्वर के विराट रूप को देख सकता है।",
      "समय और काल ईश्वर के अधीन हैं।",
      "भक्ति और शरणागति से ईश्वर का स्वरूप समझ आता है।",
      "ईश्वर सर्वव्यापी और सर्वशक्तिमान है।",
    ],
  },
  {
    num: 12,
    title: "भक्ति योग",
    points: [
      "भक्ति सबसे सरल और प्रभावी मार्ग है।",
      "ईश्वर का ध्यान करने वाला भक्त प्रिय है।",
      "समर्पण से मन की शांति मिलती है।",
      "सभी प्राणियों में ईश्वर को देखो।",
      "भक्ति में शुद्ध भाव ही पर्याप्त है।",
    ],
  },
  {
    num: 13,
    title: "क्षेत्र क्षेत्रज्ञ विभाग योग",
    points: [
      "शरीर क्षेत्र है, आत्मा क्षेत्रज्ञ।",
      "ज्ञान से आत्मा और परमात्मा का भेद समझो।",
      "प्रकृति और पुरुष का संयोग संसार बनाता है।",
      "जो आत्मा को जानता है, वह मुक्त हो जाता है।",
      "निर्लिप्त रहकर जीवन जियो।",
    ],
  },
  {
    num: 14,
    title: "गुण त्रय विभाग योग",
    points: [
      "सत, रज, और तम तीन गुण जीवन को प्रभावित करते हैं।",
      "गुणों से परे जाना मुक्ति है।",
      "सत्व गुण से ज्ञान और शांति मिलती है।",
      "रज और तम से बंधन उत्पन्न होते हैं।",
      "आत्मा गुणों से अछूती है।",
    ],
  },
  {
    num: 15,
    title: "पुरुषोत्तम योग",
    points: [
      "संसार एक वृक्ष है, जिसकी जड़ें ईश्वर में हैं।",
      "पुरुषोत्तम ही परम सत्य है।",
      "संसार से वैराग्य मुक्ति का मार्ग है।",
      "ईश्वर में लीन होना जीवन का लक्ष्य है।",
      "आत्मा का परमात्मा से संबंध अनादि है।",
    ],
  },
  {
    num: 16,
    title: "दैवासुर संपद् विभाग योग",
    points: [
      "दैवी गुण मुक्ति की ओर ले जाते हैं।",
      "आसुरी गुण बंधन का कारण बनते हैं।",
      "सत्य और धर्म का पालन करो।",
      "लोभ और क्रोध से बचो।",
      "शास्त्र जीवन का मार्गदर्शक है।",
    ],
  },
  {
    num: 17,
    title: "श्रद्धा त्रय विभाग योग",
    points: [
      "श्रद्धा जीवन के कार्यों को निर्धारित करती है।",
      "सात्विक श्रद्धा शांति देती है।",
      "राजसिक और तामसिक श्रद्धा अशांति लाती है।",
      "आहार और व्यवहार श्रद्धा को प्रभावित करते हैं।",
      '"ॐ तत् सत्" ईश्वर का स्मरण है।',
    ],
  },
  {
    num: 18,
    title: "मोक्ष संन्यास योग",
    points: [
      "कर्तव्य का पालन ही सच्चा त्याग है।",
      "ज्ञान, कर्म और भक्ति से मोक्ष मिलता है।",
      "ईश्वर की शरण में सब कुछ समर्पित करो।",
      "मन को नियंत्रित कर आत्मा को जानो।",
      "पूर्ण समर्पण से परम शांति प्राप्त होती है।",
    ],
  },
];

const COMMISSION_RATES = [
  { level: "L1", amount: "₹25", pct: "25%" },
  { level: "L2", amount: "₹15", pct: "15%" },
  { level: "L3", amount: "₹10", pct: "10%" },
  { level: "L4", amount: "₹5", pct: "5%" },
  { level: "L5", amount: "₹4", pct: "4%" },
  { level: "L6", amount: "₹3", pct: "3%" },
  { level: "L7", amount: "₹2", pct: "2%" },
  { level: "L8", amount: "₹1", pct: "1%" },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);

  const cardStyle = {
    background: "oklch(0.17 0.025 55)",
    border: "1px solid oklch(0.4 0.08 65 / 0.25)",
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-20 md:py-32"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.09 0.018 50) 0%, oklch(0.14 0.03 55) 40%, oklch(0.12 0.025 60) 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "oklch(0.75 0.18 65)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "oklch(0.65 0.2 50)" }}
        />

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{
              background: "oklch(0.75 0.18 65 / 0.1)",
              border: "1px solid oklch(0.75 0.18 65 / 0.25)",
              color: "oklch(0.8 0.15 70)",
            }}
          >
            🕉️ श्रीमद्भगवद्गीता
          </div>

          <h1
            className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
            style={{ color: "oklch(0.92 0.03 75)" }}
          >
            <span className="gold-text">भगवद्गीता</span>
            <br />
            <span style={{ color: "oklch(0.85 0.06 75)" }}>का सार</span>
          </h1>

          <p
            className="text-xl md:text-2xl font-bold mb-4"
            style={{ color: "oklch(0.75 0.18 65)" }}
          >
            100 बिंदुओं का वर्णन
          </p>

          <p
            className="text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "oklch(0.7 0.04 65)" }}
          >
            18 अध्यायों में जीवन का सम्पूर्ण ज्ञान — कर्म, भक्ति और मोक्ष का मार्ग। केवल{" "}
            <span
              style={{ color: "oklch(0.75 0.18 65)" }}
              className="font-bold"
            >
              ₹100
            </span>{" "}
            में पाएं जीवन बदलने वाला ज्ञान।
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-gold px-8 py-3.5 rounded-full font-bold text-lg shadow-gold"
              >
                डैशबोर्ड देखें
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-gold px-8 py-3.5 rounded-full font-bold text-lg shadow-gold"
                >
                  अभी रजिस्टर करें
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3.5 rounded-full font-bold text-lg transition-all"
                  style={{
                    border: "2px solid oklch(0.75 0.18 65)",
                    color: "oklch(0.12 0.02 55)",
                    background:
                      "linear-gradient(135deg, oklch(0.75 0.18 65), oklch(0.65 0.2 50))",
                  }}
                >
                  लॉगिन करें
                </Link>
              </>
            )}
          </div>

          {/* PWA Install */}
          <div className="flex justify-center">
            <InstallButton />
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        className="py-16 px-4"
        style={{ background: "oklch(0.14 0.022 55)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="om-divider mb-4">
              <span>ॐ</span>
            </div>
            <h2 className="text-3xl font-bold gold-text">हमारी विशेषताएं</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: BookOpen,
                title: "18 अध्याय",
                desc: "सम्पूर्ण भगवद्गीता के 18 अध्यायों का सार",
              },
              {
                icon: Award,
                title: "100 बिंदु",
                desc: "जीवन बदलने वाले 100 महत्वपूर्ण बिंदु",
              },
              {
                icon: Users,
                title: "रेफरल कमीशन",
                desc: "8 स्तर तक कमीशन — ₹25 से ₹1 तक",
              },
              {
                icon: TrendingUp,
                title: "वॉलेट सिस्टम",
                desc: "कमाई को वॉलेट में जमा करें और निकालें",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl p-5 text-center hover:scale-105 transition-transform"
                style={cardStyle}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{
                    background: "oklch(0.75 0.18 65 / 0.1)",
                    border: "1px solid oklch(0.75 0.18 65 / 0.2)",
                  }}
                >
                  <feature.icon
                    size={22}
                    style={{ color: "oklch(0.75 0.18 65)" }}
                  />
                </div>
                <h3
                  className="font-bold text-base mb-1.5"
                  style={{ color: "oklch(0.85 0.08 70)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.6 0.03 65)" }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section
        className="py-16 px-4"
        style={{ background: "oklch(0.12 0.02 55)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="om-divider mb-4">
            <span>ॐ</span>
          </div>
          <h2 className="text-3xl font-bold mb-3 gold-text">
            रेफरल कमीशन सिस्टम
          </h2>
          <p
            className="text-base mb-10"
            style={{ color: "oklch(0.65 0.04 65)" }}
          >
            अपने रेफरल कोड से दूसरों को जोड़ें और 8 स्तर तक कमीशन कमाएं
          </p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-8">
            {COMMISSION_RATES.map((item) => (
              <div
                key={item.level}
                className="rounded-xl p-3 text-center"
                style={{
                  background: "oklch(0.17 0.025 55)",
                  border: "1px solid oklch(0.4 0.08 65 / 0.25)",
                }}
              >
                <div
                  className="font-bold text-lg"
                  style={{ color: "oklch(0.85 0.18 70)" }}
                >
                  {item.amount}
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: "oklch(0.65 0.04 65)" }}
                >
                  {item.level}
                </div>
              </div>
            ))}
          </div>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="btn-gold px-8 py-3.5 rounded-full font-bold text-lg inline-block"
            >
              अभी जुड़ें और कमाएं
            </Link>
          )}
        </div>
      </section>

      {/* 100 Points - 18 Chapters */}
      <section
        className="py-16 px-4"
        style={{ background: "oklch(0.14 0.022 55)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="om-divider mb-4">
              <span>ॐ</span>
            </div>
            <h2 className="text-3xl font-bold mb-3 gold-text">
              भगवद्गीता का सार
            </h2>
            <p className="text-base" style={{ color: "oklch(0.65 0.04 65)" }}>
              18 अध्यायों के 100 दिव्य बिंदु
            </p>
          </div>

          <div className="space-y-3">
            {CHAPTERS.map((chapter) => (
              <div
                key={chapter.num}
                className="rounded-xl overflow-hidden"
                style={cardStyle}
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedChapter(
                      expandedChapter === chapter.num ? null : chapter.num,
                    )
                  }
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-primary/5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.8 0.18 75), oklch(0.65 0.2 50))",
                        color: "oklch(0.12 0.02 55)",
                      }}
                    >
                      {chapter.num}
                    </span>
                    <div>
                      <span
                        className="font-bold text-sm"
                        style={{ color: "oklch(0.85 0.08 70)" }}
                      >
                        अध्याय {chapter.num}:
                      </span>
                      <span
                        className="ml-2 text-sm"
                        style={{ color: "oklch(0.75 0.18 65)" }}
                      >
                        {chapter.title}
                      </span>
                    </div>
                  </div>
                  {expandedChapter === chapter.num ? (
                    <ChevronUp
                      size={18}
                      style={{ color: "oklch(0.65 0.04 65)" }}
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                      style={{ color: "oklch(0.65 0.04 65)" }}
                    />
                  )}
                </button>

                {expandedChapter === chapter.num && (
                  <div
                    className="px-5 pb-5"
                    style={{ borderTop: "1px solid oklch(0.35 0.06 60 / 0.3)" }}
                  >
                    <div className="pt-4 space-y-2">
                      {chapter.points.map((point, idx) => (
                        <div
                          key={`${chapter.num}-${idx}`}
                          className="flex items-start gap-3"
                        >
                          <span
                            className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{
                              background: "oklch(0.75 0.18 65 / 0.15)",
                              color: "oklch(0.75 0.18 65)",
                              border: "1px solid oklch(0.75 0.18 65 / 0.2)",
                            }}
                          >
                            {(chapter.num - 1) * 5 + idx + 1}
                          </span>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: "oklch(0.78 0.04 68)" }}
                          >
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* View all CTA */}
          <div className="text-center mt-8">
            <Link
              to="/book"
              className="btn-gold px-8 py-3.5 rounded-full font-bold text-base inline-flex items-center gap-2"
            >
              <BookOpen size={18} />
              पूरी पुस्तक पढ़ें
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-20 px-4 text-center"
        style={{ background: "oklch(0.12 0.02 55)" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-5">🕉️</div>
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: "oklch(0.85 0.08 70)" }}
          >
            "धीमी और स्थिर चाल से दौड़ जीती जाती है"
          </h2>
          <p
            className="text-lg mb-8 leading-relaxed"
            style={{ color: "oklch(0.6 0.03 65)" }}
          >
            भगवद्गीता का ज्ञान अपनाएं, जीवन में सफलता पाएं।
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="btn-gold px-10 py-4 rounded-full font-bold text-xl inline-block shadow-gold"
            >
              आज ही शुरू करें — ₹100
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
