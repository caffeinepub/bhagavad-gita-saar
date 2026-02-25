export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-3xl font-devanagari font-bold text-maroon mb-2">गोपनीयता नीति</h1>
          <p className="font-devanagari text-maroon/60 text-sm">
            अंतिम अपडेट: {new Date().toLocaleDateString('hi-IN')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gold/20 p-8 space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-devanagari font-bold text-maroon mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-saffron/20 text-saffron rounded-full flex items-center justify-center text-sm font-bold">1</span>
              डेटा गोपनीयता नीति
            </h2>
            <div className="font-devanagari text-maroon/80 text-sm leading-relaxed space-y-2">
              <p>
                हम आपकी व्यक्तिगत जानकारी की सुरक्षा को सर्वोच्च प्राथमिकता देते हैं। आपके द्वारा
                प्रदान की गई जानकारी — जैसे फ़ोन नंबर, UPI ID — केवल सेवा प्रदान करने के लिए उपयोग
                की जाती है।
              </p>
              <p>
                हम आपकी जानकारी किसी तीसरे पक्ष को नहीं बेचते या साझा नहीं करते, सिवाय उन
                मामलों के जहाँ कानूनी आवश्यकता हो।
              </p>
              <p>
                आपका डेटा सुरक्षित सर्वर पर संग्रहीत किया जाता है और अनधिकृत पहुँच से सुरक्षित है।
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-devanagari font-bold text-maroon mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-saffron/20 text-saffron rounded-full flex items-center justify-center text-sm font-bold">2</span>
              कुकीज़ नीति
            </h2>
            <div className="font-devanagari text-maroon/80 text-sm leading-relaxed space-y-2">
              <p>
                हमारी वेबसाइट आपके अनुभव को बेहतर बनाने के लिए कुकीज़ और लोकल स्टोरेज का उपयोग
                करती है।
              </p>
              <p>
                <strong>सत्र कुकीज़:</strong> लॉगिन स्थिति बनाए रखने के लिए उपयोग की जाती हैं।
              </p>
              <p>
                <strong>लोकल स्टोरेज:</strong> आपके खाते की जानकारी, वॉलेट बैलेंस और कमीशन
                डेटा स्थानीय रूप से संग्रहीत किया जाता है।
              </p>
              <p>
                आप अपने ब्राउज़र सेटिंग्स से कुकीज़ को नियंत्रित कर सकते हैं, हालाँकि इससे
                कुछ सुविधाएँ प्रभावित हो सकती हैं।
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-devanagari font-bold text-maroon mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-saffron/20 text-saffron rounded-full flex items-center justify-center text-sm font-bold">3</span>
              भुगतान जानकारी
            </h2>
            <div className="font-devanagari text-maroon/80 text-sm leading-relaxed space-y-2">
              <p>
                हम UPI भुगतान प्रणाली का उपयोग करते हैं। भुगतान के लिए आपको हमारे UPI लिंक पर
                रीडायरेक्ट किया जाता है।
              </p>
              <p>
                <strong>UTR नंबर:</strong> भुगतान सत्यापन के लिए आपका UTR नंबर एडमिन को दिखाया
                जाता है। यह जानकारी केवल सत्यापन उद्देश्य के लिए उपयोग की जाती है।
              </p>
              <p>
                <strong>UPI ID:</strong> निकासी के लिए आपकी UPI ID एडमिन को दिखाई जाती है ताकि
                भुगतान प्रोसेस किया जा सके।
              </p>
              <p>
                हम किसी भी बैंक कार्ड या नेट बैंकिंग जानकारी संग्रहीत नहीं करते।
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-devanagari font-bold text-maroon mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-saffron/20 text-saffron rounded-full flex items-center justify-center text-sm font-bold">4</span>
              रेफरल और कमीशन डेटा
            </h2>
            <div className="font-devanagari text-maroon/80 text-sm leading-relaxed space-y-2">
              <p>
                रेफरल सिस्टम के तहत, आपका रेफरल कोड और कमीशन इतिहास हमारे सिस्टम में संग्रहीत
                किया जाता है।
              </p>
              <p>
                कमीशन वितरण स्वचालित रूप से होता है जब आपके रेफरल से कोई नया उपयोगकर्ता ID
                एक्टिवेट करता है।
              </p>
              <p>
                कमीशन संरचना: L1=25%, L2=15%, L3=10%, L4=8%, L5=6%, L6=5%, L7=4%, L8=3%,
                L9=2%, L10=1%
              </p>
              <p>
                आपका रेफरल नेटवर्क डेटा केवल कमीशन गणना के लिए उपयोग किया जाता है।
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-devanagari font-bold text-maroon mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-saffron/20 text-saffron rounded-full flex items-center justify-center text-sm font-bold">5</span>
              आपके अधिकार
            </h2>
            <div className="font-devanagari text-maroon/80 text-sm leading-relaxed space-y-2">
              <p>आपको निम्नलिखित अधिकार हैं:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>अपनी जानकारी देखने का अधिकार</li>
                <li>अपनी जानकारी सुधारने का अधिकार</li>
                <li>अपना खाता बंद करने का अधिकार</li>
                <li>डेटा पोर्टेबिलिटी का अधिकार</li>
              </ul>
              <p>
                किसी भी प्रश्न के लिए हमसे संपर्क करें:{' '}
                <a
                  href="mailto:bhagavadgitamargs@gmail.com"
                  className="text-saffron hover:text-gold transition-colors"
                >
                  bhagavadgitamargs@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-devanagari font-bold text-maroon mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-saffron/20 text-saffron rounded-full flex items-center justify-center text-sm font-bold">6</span>
              नीति में परिवर्तन
            </h2>
            <div className="font-devanagari text-maroon/80 text-sm leading-relaxed">
              <p>
                हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। किसी भी महत्वपूर्ण
                परिवर्तन की सूचना आपको ईमेल या वेबसाइट पर दी जाएगी।
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
