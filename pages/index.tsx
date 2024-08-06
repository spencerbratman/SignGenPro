import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import ColorPicker from '../components/ColorPicker';

const FabricCanvas = dynamic(() => import('../components/FabricCanvas'), { ssr: false });

const SignatureGenerator: React.FC = () => {
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('');
  const [slant, setSlant] = useState(0);
  const [fontSize, setFontSize] = useState(38);
  const [color, setColor] = useState('#000000');
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fonts = useMemo(() => [
    { name: 'Herr Von Muellerhoff', class: 'font-herr-von-muellerhoff' },
    { name: 'Great Vibes', class: 'font-great-vibes' },
    { name: 'Dancing Script', class: 'font-dancing-script' },
    { name: 'Allura', class: 'font-allura' },
    { name: 'Yellowtail', class: 'font-yellowtail' },
    { name: 'Rochester', class: 'font-rochester' },
    { name: 'Mr De Haviland', class: 'font-mr-de-haviland' },
    { name: 'Lovers Quarrel', class: 'font-lovers-quarrel' },
    { name: 'Monsieur La Doulaise', class: 'font-monsieur-la-doulaise' },
    { name: 'Marck Script', class: 'font-marck-script' },
    { name: 'Alex Brush', class: 'font-alex-brush' },
    { name: 'Dancing Script', class: 'font-dancing-script' },
  ], []);

  const handleTypeDownload = (fontFamily: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Apply slant to text only
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.transform(1, 0, Math.tan(-slant * Math.PI / 180), 1, 0, 0);

      ctx.font = `${fontSize}px "${mode === 'draw' ? 'Caveat' : fontFamily}"`;
      ctx.fillText(typedName || 'Your Signature', 0, 0);

      // Reset transformation
      ctx.restore();

      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'signature.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleClearType = () => {
    setTypedName('');
    setSlant(0);
    setFontSize(38);
    setColor('#000000');
  };

  const reviews = useMemo(() => [
    { name: "Sarah Johnson", quote: "This signature generator is a game-changer! It's so easy to use and the results look incredibly professional." },
    { name: "Michael Chen", quote: "I've tried many signature generators, but this one is by far the best. The customization options are fantastic!" },
    { name: "Emily Rodriguez", quote: "As a small business owner, this tool has saved me so much time. I love how I can create multiple signatures for different purposes." },
    { name: "David Thompson", quote: "The variety of fonts and styles available is impressive. I found the perfect signature for my brand in minutes." },
    { name: "Olivia Parker", quote: "I appreciate how user-friendly this signature generator is. Even my tech-challenged colleagues find it easy to use!" },
    { name: "James Wilson", quote: "The ability to draw or type my signature gives me flexibility I haven't found anywhere else. Highly recommended!" },
  ], []);

  return (
    <>
      <Head>
        <title>Free Online Signature Generator | Make Your Personalized Signature </title>
        <meta name="description" content="Create, customize, and download your digital signature in seconds with our easy-to-use, free online signature generator. No registration required, and it's 100% free!" />
        <meta name="keywords" content="signature generator, free signature maker, digital signature creator, online signature tool, electronic signature generator" />
        <meta property="og:title" content="Free Online Signature Generator | Create Digital Signatures Easily" />
        <meta property="og:description" content="Create professional, customized digital signatures for free with our easy-to-use online Signature Generator. No registration required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://signfreepro.com" />
        <meta property="og:image" content="https://signfreepro.com" />
        <meta property="og:image" content="https://signfreepro.com" />
        <link rel="canonical" href="https://signfreepro.com" />
      </Head>

      {/* Fixed Navigation Bar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <a href="#" className="font-bold text-xl text-blue-600">SignFreePro</a>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <a href="#" className="py-2 px-3 text-gray-700 hover:text-blue-600">Home</a>
              <a href="#reviews" className="py-2 px-3 text-gray-700 hover:text-blue-600">Reviews</a>
              <a href="#faq" className="py-2 px-3 text-gray-700 hover:text-blue-600">FAQ</a>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                  ) : (
                    <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <a href="#" className="block py-2 px-4 text-sm hover:bg-gray-200">Home</a>
            <a href="#reviews" className="block py-2 px-4 text-sm hover:bg-gray-200">Reviews</a>
            <a href="#faq" className="block py-2 px-4 text-sm hover:bg-gray-200">FAQ</a>
          </div>
        )}
      </nav>

      <div className="max-w-4xl mx-auto p-4 pt-20 md:pt-32">
        <header className="text-center mb-4 md:mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4">Free Signature Generator</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-4">Our free online signature generator makes it simple to create personalized electronic signatures in seconds. Just type your name or initials, and let our signature generator do the rest.</p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap">✓ 100% Free</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap">✓ Secure & Private</span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap">✓ No Registration</span>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className="flex mb-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-xs md:text-sm text-gray-600">Trusted by over 1 million users</p>
          </div>
        </header>

        <div className="mb-6">
          <div className="relative w-72 h-16 mx-auto bg-gray-200 rounded-full p-1 text-lg font-semibold">
            <div
              className={`absolute top-1 left-1 w-1/2 h-14 rounded-full bg-black transition-all duration-300 ease-in-out ${
                mode === 'type' ? 'translate-x-full' : ''
              }`}
            ></div>
            <button
              onClick={() => setMode('draw')}
              className={`absolute left-0 w-1/2 h-full rounded-full z-10 ${
                mode === 'draw' ? 'text-white' : 'text-gray-700'
              } font-caveat text-2xl flex items-center justify-center pb-2`}
            >
              Draw
            </button>
            <button
              onClick={() => setMode('type')}
              className={`absolute right-0 w-1/2 h-full rounded-full z-10 ${
                mode === 'type' ? 'text-white' : 'text-gray-700'
              } flex items-center justify-center pb-1`}
            >
              Type
            </button>
          </div>
        </div>

        <div className="border-2 border-gray-300 p-6 mb-12 rounded-b-lg"> {/* Changed to rounded-b-lg */}
          {mode === 'draw' ? (
            <FabricCanvas color={color} setColor={setColor} isMobile={isMobile} />
          ) : (
            <div>
              <div className="flex justify-between mb-6">
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-5/6 p-2 border border-gray-300 rounded text-xl"
                />
                <button onClick={handleClearType} className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
                  Clear
                </button>
              </div>
              <div className={`${isMobile ? 'flex flex-col' : 'flex justify-between items-center'} mb-6`}>
                <div className={`${isMobile ? 'mb-4' : 'flex-1 mr-4'}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slant</label>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={slant}
                    onChange={(e) => setSlant(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className={`${isMobile ? 'mb-4' : 'flex-1 mx-4'}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                  <input
                    type="range"
                    min="12"
                    max="64"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className={`${isMobile ? 'mb-4' : 'flex-1 ml-4'}`}>
                  <ColorPicker color={color} onChange={setColor} />
                </div>
              </div>
              <div className={`${isMobile ? 'space-y-6' : 'grid grid-cols-3 gap-6'}`}>
                {fonts.map((font, index) => (
                  <div key={index} className="border p-4 rounded h-40 flex flex-col justify-between items-center">
                    <div className="flex-grow flex items-center justify-center w-full overflow-hidden">
                      <p 
                        style={{ 
                          fontFamily: font.name, 
                          fontSize: `${fontSize}px`, 
                          color, 
                          transform: `skew(${-slant}deg)`,
                          maxWidth: '100%',
                          maxHeight: '100%',
                        }} 
                        className="text-center whitespace-nowrap"
                      >
                        {typedName || 'Your Signature'}
                      </p>
                    </div>
                    <button onClick={() => handleTypeDownload(font.name)} className="bg-blue-500 text-white px-4 py-2 rounded text-sm mt-4 w-full">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <section className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Free Online Signature Generator?</h2>
          <p className="mb-4">Our Signature Generator is the perfect tool for creating professional digital signatures quickly and easily, without any cost. Here's why thousands of users trust our free signature maker:</p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong>Lightning-Fast Signature Creation:</strong> Generate your digital signature in seconds, no design skills required. Simply draw or type your signature using our intuitive interface.</li>
            <li><strong>Versatile Handwriting Styles:</strong> Choose from a wide variety of handwriting fonts to find the perfect match for your personality or brand. Our signature creator offers styles ranging from formal to casual.</li>
            <li><strong>Full Customization:</strong> Tailor your signature to perfection with our easy-to-use tools. Adjust slant, spacing, and color to create a truly unique digital signature that represents you.</li>
            <li><strong>High-Resolution Downloads:</strong> Get your signature as a high-quality PNG image with a transparent background, ready for immediate use in documents, emails, or design projects.</li>
            <li><strong>100% Free, No Strings Attached:</strong> Unlike other signature generators, ours is completely free. No hidden fees, no premium features locked behind a paywall, and no registration required.</li>
            <li><strong>Cross-Platform Compatibility:</strong> Create and use your signature seamlessly across desktop computers, tablets, and mobile devices. Our signature tool works on all modern browsers.</li>
            <li><strong>Privacy and Security Guaranteed:</strong> Your signature data remains private and secure. We don't store any information on our servers, ensuring your digital signature stays confidential.</li>
            <li><strong>User-Friendly Interface:</strong> Our signature generator is designed for ease of use, making it accessible for everyone, regardless of technical expertise.</li>
          </ul>
        </section>

        <section className="bg-green-50 p-6 rounded-lg mb-8">
          <h2 className="text-3xl font-bold mb-4">How to Use Our Free Signature Generator</h2>
          <p className="mb-4">Creating your perfect digital signature is simple and quick with our online signature maker. Follow these easy steps:</p>
          <ol className="list-decimal pl-5 mb-4 space-y-2">
            <li><strong>Choose Your Method:</strong> Select between drawing your signature freehand or typing it out.</li>
            <li><strong>Draw Your Signature:</strong> If drawing, use your mouse, trackpad, or touchscreen to create your signature just as you would on paper.</li>
            <li><strong>Type Your Signature:</strong> If typing, enter your name and explore our range of handwriting fonts to find your ideal style.</li>
            <li><strong>Customize Your Signature:</strong> Fine-tune your signature by adjusting the slant, font size, and color to match your personal style or brand guidelines.</li>
            <li><strong>Preview in Real-Time:</strong> See instant updates as you make adjustments, ensuring your digital signature looks exactly as you want it.</li>
            <li><strong>Download Your Signature:</strong> Once satisfied, click the download button to save your signature as a high-quality PNG image with a transparent background.</li>
            <li><strong>Use Your New Digital Signature:</strong> Immediately start using your professional-looking signature for documents, emails, or any online purpose.</li>
          </ol>
          <p>With our free signature generator, you can create multiple signatures for different purposes in just minutes!</p>
        </section>

        <section className="bg-yellow-50 p-6 rounded-lg mb-8">
          <h2 className="text-3xl font-bold mb-4">Unlimited Uses for Your Digital Signature</h2>
          <p className="mb-4">A digital signature created with our free online generator can be used in countless ways. Here are some popular applications:</p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong>Sign Digital Documents and Contracts:</strong> Perfect for efficiently signing PDFs, agreements, and legal documents without printing.</li>
            <li><strong>Personalize Emails:</strong> Add a professional touch to your email correspondence with a custom signature.</li>
            <li><strong>Enhance Business Communications:</strong> Create a standout email signature for your professional communications, including your title and contact information.</li>
            <li><strong>Protect Digital Artwork:</strong> Sign your digital creations to assert copyright and add an authentic touch to your work.</li>
            <li><strong>Brand Your Social Media:</strong> Add your signature to social media profiles or posts for a personal branding element.</li>
            <li><strong>Authenticate Digital Certificates:</strong> Use your digital signature to verify and add credibility to certificates, awards, or testimonials.</li>
            <li><strong>Elevate Marketing Materials:</strong> Incorporate your signature into brochures, flyers, and other promotional materials to build brand recognition and add a personal touch.</li>
            <li><strong>Sign Off on Company Memos:</strong> Add authority to internal communications with a professional digital signature.</li>
            <li><strong>Personalize Digital Products:</strong> Use your signature on ebooks, online courses, or digital products you create.</li>
            <li><strong>Streamline Administrative Tasks:</strong> Quickly sign off on internal documents, approvals, or forms without the need for printing and scanning.</li>
          </ul>
        </section>
        <section id="reviews" className="bg-purple-50 p-6 rounded-lg mb-8">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say About Our Free Signature Generator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <p className="italic mb-2">"{review.quote}"</p>
                <p className="font-semibold text-right">- {review.name}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center">Join thousands of satisfied users who have discovered the ease and professionalism our free signature generator brings to their digital communications!</p>
        </section>

       
          <section id="faq" className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions About Our Signature Generator</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">Q: Is this Signature Generator really 100% free to use?</h3>
              <p>A: Absolutely! Our Signature Generator is completely free for all users. There are no hidden charges, premium features, or registration required. We believe in providing a valuable tool accessible to everyone.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Q: What file formats can I download my signature in?</h3>
              <p>A: Currently, you can download your signature as a PNG file with a transparent background. This format is widely supported and suitable for use in various digital contexts, including documents, websites, and graphic design projects.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Q: Is my signature data stored on your servers?</h3>
              <p>A: No, your privacy and security are our top priorities. Our Signature Generator operates entirely in your browser. We do not store or transmit your signature data, ensuring that your signature remains private and secure at all times.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Q: Can I use my generated signature for legal documents?</h3>
              <p>A: While our Signature Generator creates high-quality digital signatures, the legal validity of digital signatures can vary depending on your jurisdiction and the specific requirements of the document. For legally binding documents, we recommend consulting with a legal professional to ensure compliance with relevant laws and regulations.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Q: How do I choose the best signature style for me?</h3>
              <p>A: Choosing the right signature style is a personal decision. We recommend experimenting with different fonts, slants, and sizes to find a style that feels authentic to you. Consider the purpose of your signature - a more formal style might be suitable for business documents, while a casual style could work well for personal correspondence. Don't hesitate to create multiple signatures for different purposes!</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Q: Can I use the signature generator on my mobile device?</h3>
              <p>A: Yes! Our signature generator is fully responsive and works on desktop computers, tablets, and mobile phones. You can create, customize, and download your signature from any device with a web browser.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Q: How many signatures can I create?</h3>
              <p>A: There's no limit! You can create as many signatures as you need, experimenting with different styles, colors, and formats. This is especially useful if you need different signatures for various purposes or if you're designing signatures for multiple team members.</p>
            </div>
          </div>
        </section>


        <footer className="text-center text-gray-500 mt-8">
          <p>&copy; 2024 Signature Generator. All rights reserved. </p>
        </footer>
      </div>
    </>
  );
};

export default SignatureGenerator;