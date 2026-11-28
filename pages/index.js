import Head from "next/head";
import dynamic from "next/dynamic";
const Footer = dynamic(() => import("@/component/footer/footer"));
import { Inter } from "next/font/google";
import Link from "next/link";
import ScrollToTop from "react-scroll-to-top";

const Index = dynamic(() => import("@/component/countries"));
const Header2 = dynamic(() => import("@/component/header/header2"));
const Search = dynamic(() => import("@/component/search/search"));

const inter = Inter({ subsets: ["vietnamese"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Parag - Free Local Classifieds</title>
        <meta
          name='description'
          content='Parag is a free local classifieds site for community, dating, marketplace and services, in cities around the world.'
        />
        <title> Parag - Live Classifieds Directory </title>
        <meta
          name='description'
          content='Parag is a live classifieds directory featuring an open community, casual dating, a B2B marketplace, and services listing.'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link
          name='canonical'
          rel='canonical'
          href={`https://parag.live/`}
        />{" "}
        <meta
          name='title'
          content='Parag - Free Local Classifieds'
          content='Parag - Live Classifieds Directory'
        />
        <meta name='keywords' content='' />
        <link rel='icon' href='/favicon.ico' />
        <meta
          name='google-site-verification'
          content='LY6Z48B7wRP_Hrd7cDAs3wQjh83MGwWSv8hHQd6Ue6o'
        />
        <meta name='tlsdk' content='90c01e78bd56459db4fa068765c5fdeb'></meta>
      </Head>

      <div className='page-bg'>
        <Header2 />
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
        >
          <Search />
          <Index />

        </div>

        <ScrollToTop smooth />
        <Footer />
      </div>
    </>
  );
}
