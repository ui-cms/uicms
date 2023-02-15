import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import Link from "next/link";
import styles from "@/styles/Layout.module.scss";
import { MdAddCircle } from "react-icons/md";
import { FaGithub } from "react-icons/fa";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children, title, description }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title={title} description={description} />
      {children}
    </>
  );
}

export function Page({
  children,
  title = "UI CMS",
  description = "Simple yet powerfull gitbased CMS",
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <main
        className={`container is-fluid py-5 has-background-light ${inter.className} ${styles.main}`}
      >
        {children}
      </main>
    </>
  );
}

function Header() {
  const [burgerMenuIsActive, setBurgerMenuIsActive] = useState(false);
  const isAuthenticated = true;
  return (
    <header className={inter.className}>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <div className="navbar-item">
            <div className="dropdown is-hoverable">
              <div className="dropdown-trigger">
                <a
                  className={"navbar-item " + styles.logo}
                  aria-haspopup="true"
                  aria-controls="brand-dropdown-menu"
                >
                  <Image
                    src="/logo.svg"
                    alt="UI CMS logo"
                    width={84}
                    height={40}
                    priority
                  />
                </a>
              </div>
              <div
                className="dropdown-menu"
                id="brand-dropdown-menu"
                role="menu"
              >
                <div className="dropdown-content">
                  <a
                    href="#"
                    className="dropdown-item"
                    target="_blank"
                    rel="noreferrer"
                  >
                    About UICMS
                  </a>
                  <a
                    href="#"
                    className="dropdown-item"
                    target="_blank"
                    rel="noreferrer"
                  >
                    News
                  </a>
                  <a
                    href="#"
                    className="dropdown-item"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Support
                  </a>
                  <a
                    href="#"
                    className="dropdown-item"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Give a star
                  </a>
                  <a
                    href="https://google.com"
                    className="dropdown-item"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Donate
                  </a>
                </div>
              </div>
            </div>
          </div>

          <a
            onClick={() => setBurgerMenuIsActive(!burgerMenuIsActive)}
            className={`navbar-burger ${burgerMenuIsActive ? "is-active" : ""}`}
            role="button"
            aria-label="menu"
            aria-expanded="false"
            data-target="main-menu"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div
          id="main-menu"
          className={`navbar-menu ${burgerMenuIsActive ? "is-active" : ""}`}
        >
          <div className="navbar-end">
            <Link className="navbar-item" href="/">
              Home
            </Link>
            <Link className="navbar-item" href="/editor">
              Editor
            </Link>

            <div className="navbar-item has-dropdown is-hoverable">
              <Link className="navbar-link" href="/">
                Articles
              </Link>
              <div className="navbar-dropdown">
                <Link className="navbar-item" href="/editor">
                  Add new
                </Link>
              </div>
            </div>
            <div className="navbar-item has-dropdown is-hoverable">
              <Link className="navbar-link" href="/">
                News
              </Link>
              <div className="navbar-dropdown">
                <Link className="navbar-item" href="/editor">
                  Add new
                </Link>
              </div>
            </div>
            <div className="navbar-item has-dropdown is-hoverable">
              <Link className="navbar-link" href="/">
                Events
              </Link>
              <div className="navbar-dropdown">
                <Link className="navbar-item" href="/editor">
                  Add new
                </Link>
              </div>
            </div>

            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">More</a>
              <div className="navbar-dropdown">
                <a className="navbar-item">FAQs</a>
                <a className="navbar-item">Events</a>
                <a className="navbar-item">Slides</a>
              </div>
            </div>

            {!isAuthenticated ? (
              <div className="navbar-item">
                <button className="button is-dark">
                  <span className="icon">
                    <FaGithub />
                  </span>
                  <strong>Sign in with GitHub</strong>
                </button>
              </div>
            ) : (
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link is-arrowless">
                  <div className="is-flex is-flex-direction-column">
                    <figure className="image is-24x24 is-align-self-center">
                      <Image
                        className="is-rounded"
                        src="/user.png"
                        width="32"
                        height="32"
                        alt="username"
                      />
                    </figure>
                    <span className="is-size-7">username</span>
                  </div>
                </a>
                <div className="navbar-dropdown is-right">
                  <a className="navbar-item">GitHub account</a>
                  <a className="navbar-item">Settings</a>
                  <a className="navbar-item">Log out</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
