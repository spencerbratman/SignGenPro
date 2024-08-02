import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&family=Great+Vibes&family=Allura&family=Yellowtail&family=Rochester&family=Mr+De+Haviland&family=Lovers+Quarrel&family=Monsieur+La+Doulaise&family=Herr+Von+Muellerhoff&family=Marck+Script&family=Alex+Brush&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument