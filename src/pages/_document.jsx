import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="description" content="Divo - Online Medical Appointment Management System" />
          <meta name="theme-color" content="#0ea5e9" />
          <link rel="icon" href="./images/image_2025-03-25_201444843.ico" />
          {/* You can add additional meta tags, fonts, etc. here */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 