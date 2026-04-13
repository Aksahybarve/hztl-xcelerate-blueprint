import { supportedFonts } from 'lib/fonts';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any;
  render() {
    const fontClasses = supportedFonts.map((font) => font.variable).join(' ');
    // brand-root activates the single static token set defined in tokens.css
    const bodyClasses = [fontClasses, 'brand-root'].join(' ');
    return (
      <Html>
        <Head />
        <body className={bodyClasses}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
