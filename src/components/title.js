import Head from "next/head"


export const Title = ({title}) => {
  return <Head>
    <title>
      {title}
    </title>
    <meta property="og:title" content={"Symmetry"} />
    <meta property="og:description" content={`Symmetry is an on-chain asset management protocol that enables users to create, manage, and trade tokenized baskets of multiple cryptocurrencies`} />
    <meta property="og:image" content={"https://symmetry-baskets-images.s3.eu-central-1.amazonaws.com/thumbnail.png"} />
    <meta name="twitter:card" content="summary_large_image" />
  </Head>
}