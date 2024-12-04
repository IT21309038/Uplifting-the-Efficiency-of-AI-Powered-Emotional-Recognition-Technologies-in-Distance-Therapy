import Head from "next/head";
import PropTypes from "prop-types";

export default function CustomHead({
  title,
  content,
  pageSlug,
  pageType = "website",
  ogImage = `${process.env.NEXT_PUBLIC_BASE_URL}/layout/og-image.png`,
}) {
  //   const ogTitle = title.replace(" - Some Name", "")
  //   const pageURL = `${process.env.NEXT_PUBLIC_BASE_URL}${pageSlug}`

  return (
    <Head>
      <title>{title} | Thera&apos;UP </title>
      <link rel="icon" href="/images/logo/favicon.ico" />
      {/* <meta name="description" content={content} />
      <link rel="canonical" href={pageURL} />
      <meta property="og:type" content={pageType} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={content} />
      <meta property="og:url" content={pageURL} />
      <meta property="og:image" content={ogImage} /> */}
    </Head>
  );
}

CustomHead.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  pageSlug: PropTypes.string,
  pageType: PropTypes.string,
  ogImage: PropTypes.string,
};
