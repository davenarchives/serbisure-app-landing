import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BadgeCheck,
  BriefcaseBusiness,
  Download,
  MapPin,
  Minus,
  Pencil,
  Phone,
  Plus,
  QrCode,
  X,
} from 'lucide-react';
import { createQrMatrix } from './qrCode';
import './LandingPage.css';

const screens = {
  feed: '/ui-assets/screen-1.png',
  explore: '/ui-assets/screen-2.png',
  booking: '/ui-assets/screen-3.png',
  bookings: '/ui-assets/screen-4.png',
  welcome: '/ui-assets/screen-5.png',
  role: '/ui-assets/screen-6.png',
  angledExplore: '/ui-assets/screen-7.png',
};

const features = [
  { key: 'discover', title: <>Find the Right<br />Kasambahay</>, image: screens.explore, className: 'feature-card--discover' },
  { key: 'confirm', title: <>Review and<br />Confirm Every<br />Detail</>, image: screens.booking, className: 'feature-card--confirm' },
  { key: 'manage', title: <>Keep Every<br />Booking Organized</>, image: screens.bookings, className: 'feature-card--manage' },
];

const steps = [
  ['Choose Your Role', 'Join as a homeowner looking for help or a kasambahay looking for work.'],
  ['Create and Verify your Profile', 'Add your information, work preferences, and required verification documents.'],
  ['Find the Right Match', 'Browse trusted profiles, household services, and available job opportunities.'],
  ['Connect, Book, and Manage', 'Discuss the work, confirm the details, and manage your bookings or hires.'],
];

const faqs = [
  ['What is SerbiSure?', 'SerbiSure is a simple platform that connects homeowners with kasambahay for safer and more organized household work.'],
  ['Who can use SerbiSure?', 'Homeowners looking for household help and kasambahay searching for safe and suitable work opportunities.'],
  ['How does account verification work?', 'Users submit profile and identity details so the platform can support safer, more trustworthy connections.'],
  ['Can I arrange short-term and long-term work?', 'Yes. SerbiSure supports both short-term and long-term household work arrangements.'],
  ['How do bookings and hires work?', 'Review the work details, confirm the booking, then track the arrangement from one organized screen.'],
];

const barcodeBars = [
  2.2, 1, 3.2, 1, 1.2, 2.2, 1, 2, 3, 1, 1.2, 2.4, 2, 1, 1.2, 3.2, 1, 2, 1, 1.2, 2.2, 3, 1, 1,
  2.2, 1, 3, 1.2, 2, 1, 1, 2.4, 1, 3.2, 2, 1, 1.2, 2, 1, 2.2, 3, 1, 1, 2.2, 1, 3, 1.2, 2, 1, 2.5,
];

const BarcodeSvg = () => {
  let x = 0;
  const rects = barcodeBars.map((w, i) => {
    const curX = x;
    const barW = w * 0.9;
    x += barW + (i % 3 === 0 ? 1.45 : 1.05);
    return <rect key={i} x={curX} y="0" width={barW} height="48" fill="#111113" />;
  });
  const totalWidth = x - 1.05;
  return (
    <svg
      className="faq-ticket__barcode"
      viewBox={`0 0 ${totalWidth.toFixed(2)} 48`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {rects}
    </svg>
  );
};

const Brand = () => (
  <a className="brand" href="#home" aria-label="SerbiSure home">
    <img src="/serbisure-logo.png" alt="" />
    <span>Serbi<strong>Sure</strong></span>
  </a>
);

const FaqShowcase = () => (
  <div className="faq-art" aria-label="SerbiSure booking receipt and verified profile preview">
    <div className="faq-showcase-scaler">
      <div className="faq-showcase">
      <div className="faq-dark-card" aria-hidden="true" />

      <div className="faq-ticket" aria-hidden="true">
        <div className="faq-ticket__header">
          <img className="faq-ticket__avatar" src="/ui-assets/avatar-shennie.png" alt="" />
          <div className="faq-ticket__person">
            <strong>Shennie Mae Cabanes</strong>
            <span>Kasambahay · Short-term</span>
          </div>
          <div className="faq-ticket__rate">
            <strong>₱600</strong>
            <span>/ day</span>
          </div>
        </div>

        <div className="faq-ticket__divider faq-ticket__divider--top">
          <span className="faq-notch faq-notch--paper faq-notch--left" />
          <span className="faq-notch faq-notch--paper faq-notch--right" />
        </div>

        <div className="faq-ticket__body">
          <h4>Cleaning Service</h4>
          <div className="faq-ticket__grid">
            <div><small>SERVICE DATE</small><strong>10/24/2026</strong></div>
            <div><small>WORK HOURS</small><strong>12:00PM - 5:00PM</strong></div>
            <div><small>ENGAGEMENT</small><strong>Short-term</strong></div>
            <div><small>DAILY RATE</small><strong>₱600 <em>/ day</em></strong></div>
            <div><small>WORK DAYS</small><strong>Mon, Tue, Wed</strong></div>
            <div><small>WORK REGION</small><strong>Northern Mindanao</strong></div>
          </div>
          <div className="faq-ticket__address">
            <small>ADDRESS</small>
            <div>
              <MapPin size={11} />
              <p>Zone 6, Cugman, City of Cagayan De Oro, Misamis Oriental</p>
            </div>
          </div>
        </div>

        <div className="faq-ticket__divider faq-ticket__divider--bottom">
          <span className="faq-notch faq-notch--dark faq-notch--left" />
          <span className="faq-notch faq-notch--dark faq-notch--right" />
        </div>

        <div className="faq-ticket__footer">
          <BarcodeSvg />
          <span>BK-A1158EEE</span>
        </div>
      </div>

      <div className="faq-profile" aria-hidden="true">
        <img className="faq-profile__avatar" src="/ui-assets/avatar-ryan.png" alt="" />
        <div className="faq-profile__top-pills">
          <span className="faq-profile__role">Kasambahay</span>
          <span className="faq-profile__cv">View CV</span>
        </div>

        <div className="faq-profile__info">
          <div className="faq-profile__name">
            <strong>Ryan Gosling</strong>
            <BadgeCheck size={15} />
          </div>
          <div className="faq-profile__meta"><MapPin size={11} /><span>Camaman-an, City of Cagayan De Oro</span></div>
          <div className="faq-profile__meta"><Phone size={11} /><span>+639264852472</span></div>
        </div>

        <div className="faq-profile__divider">
          <span className="faq-notch faq-notch--dark faq-notch--left" />
          <span className="faq-notch faq-notch--dark faq-notch--right" />
        </div>

        <div className="faq-profile__bottom">
          <div className="faq-profile__reviews">
            <strong>Engagement</strong>
            <span className="faq-profile__bar" />
            <small>No reviews yet</small>
          </div>
          <div className="faq-profile__tags">
            <span className="faq-profile__tag faq-profile__tag--spacer">Child Care</span>
            <span className="faq-profile__tag">Cooking</span>
            <span className="faq-profile__tag">Family Driver</span>
          </div>
          <div className="faq-profile__actions">
            <div className="faq-profile__socials">
              <span className="faq-social faq-social--fb">
                <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 4v2.1H8v3h2.5V21h3z" /></svg>
              </span>
              <span className="faq-social faq-social--ig">
                <svg viewBox="0 0 24 24" width="10.5" height="10.5" fill="none" stroke="currentColor" strokeWidth="2.1"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              </span>
              <span className="faq-social faq-social--tt">
                <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M16.6 5.8A4.1 4.1 0 0 1 15.2 3h-2.8v11.4a2.4 2.4 0 1 1-1.7-2.3V9.2a5.2 5.2 0 1 0 4.5 5.2V8.7a6.9 6.9 0 0 0 4 1.3V7.2c-1 0-2-.5-2.6-1.4Z" /></svg>
              </span>
            </div>
            <span className="faq-profile__edit"><Pencil size={8.5} /> Edit</span>
          </div>
        </div>
      </div>

        <span className="faq-floating-pill" aria-hidden="true">Child Care</span>
      </div>
    </div>
  </div>
);

const QrCodeSvg: React.FC<{ value: string }> = ({ value }) => {
  const matrix = useMemo(() => createQrMatrix(value), [value]);
  const quiet = 3;
  const total = matrix.length + quiet * 2;
  const cells: React.ReactNode[] = [];

  matrix.forEach((row, r) => {
    row.forEach((dark, c) => {
      if (dark) {
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={c + quiet}
            y={r + quiet}
            width={1.03}
            height={1.03}
            rx={0.16}
            fill="#0d0d11"
          />
        );
      }
    });
  });

  return (
    <svg
      className="qr-modal__svg"
      viewBox={`0 0 ${total} ${total}`}
      role="img"
      aria-label="QR code to download the SerbiSure Android APK"
    >
      <rect width={total} height={total} rx={2.2} fill="#ffffff" />
      {cells}
    </svg>
  );
};

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState(1);
  const [showDownloadNote, setShowDownloadNote] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(
    () => typeof window !== 'undefined' && window.location.hash === '#qr'
  );
  const closeQrBtnRef = useRef<HTMLButtonElement>(null);

  const qrTargetUrl = useMemo(() => {
    if (typeof window !== 'undefined' && window.location.origin.startsWith('http')) {
      return `${window.location.origin}/#download`;
    }
    return 'https://tryserbisure.com/#download';
  }, []);

  useEffect(() => {
    if (!isQrModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeQrBtnRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsQrModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isQrModalOpen]);

  const handleDownload = () => {
    setShowDownloadNote(true);
    window.setTimeout(() => setShowDownloadNote(false), 2600);
  };

  return (
    <div className="landing-page">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header"><div className="page-shell header-inner"><Brand /></div></header>

      <main id="main-content">
        <section className="hero" id="home">
          <div className="page-shell hero-layout">
            <div className="hero-copy">
              <h1>Building Trusted Connections For Safer &amp; Fairer Household Work</h1>
              <p>SerbiSure makes household hiring safer and simpler, from finding trusted help and agreeing on work to managing bookings and employment in one place.</p>
              <div className="cta-actions">
                <button className="download-button download-button--dark" type="button" onClick={handleDownload}>
                  <Download size={17} /> Download APK
                </button>
                <button className="download-button download-button--qr" type="button" onClick={() => setIsQrModalOpen(true)}>
                  <QrCode size={17} /> Scan with QR
                </button>
              </div>
            </div>
            <div className="hero-art" aria-label="SerbiSure home feed preview">
              <div className="hero-phone-wrap">
                <img className="orbit-asset" src="/ui-assets/orbit.svg" alt="" aria-hidden="true" />
                <img className="hero-phone" src={screens.feed} alt="SerbiSure home feed displayed on a phone" />
                <span className="hero-chip hero-chip--price">Php 6500 / month</span>
                <span className="hero-chip hero-chip--term"><BriefcaseBusiness aria-hidden="true" /> Short-term</span>
              </div>
            </div>
          </div>
        </section>

        <section className="features" aria-labelledby="features-title">
          <div className="page-shell feature-stage">
            <h2 id="features-title">Simple, Secure &amp;<br />Organized Hiring</h2>
            <div className="feature-cards">
              {features.map((feature) => (
                <article className={`feature-card ${feature.className}`} key={feature.key}>
                  <div className="feature-card__copy"><h3>{feature.title}</h3></div>
                  <img src={feature.image} alt="" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="steps" id="how-it-works">
          <div className="page-shell steps-layout">
            <div className="steps-art" aria-label="SerbiSure welcome screen preview">
              <div className="steps-phone-wrap">
                <img className="orbit-asset orbit-asset--steps" src="/ui-assets/orbit.svg" alt="" aria-hidden="true" />
                <img className="steps-phone" src={screens.welcome} alt="SerbiSure welcome screen displayed on a phone" />
              </div>
            </div>
            <div className="steps-copy">
              <h2>4 Simple Steps to Use<br />SerbiSure</h2>
              <ol className="steps-list">
                {steps.map(([title, description]) => (
                  <li key={title}><span className="step-dot" aria-hidden="true" /><div><h3>{title}</h3><p>{description}</p></div></li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="faq-section" id="faqs">
          <div className="page-shell faq-layout">
            <div className="faq-copy">
              <h2>Have Questions About<br />SerbiSure?</h2>
              <div className="accordion">
                {faqs.map(([question, answer], index) => {
                  const isOpen = openFaq === index;
                  return (
                    <article className={`faq-item ${isOpen ? 'faq-item--open' : ''}`} key={question}>
                      <button type="button" aria-expanded={isOpen} aria-controls={`faq-answer-${index}`} onClick={() => setOpenFaq(isOpen ? -1 : index)}>
                        <span>{question}</span>
                        {isOpen ? <Minus size={16} strokeWidth={1.75} /> : <Plus size={16} strokeWidth={1.75} />}
                      </button>
                      <div className="faq-answer" id={`faq-answer-${index}`} aria-hidden={!isOpen}><div><p>{answer}</p></div></div>
                    </article>
                  );
                })}
              </div>
            </div>
            <FaqShowcase />
          </div>
        </section>

        <section className="download-section" id="download">
          <div className="page-shell download-panel">
            <div className="download-art" aria-label="SerbiSure role and discovery screens">
              <img className="download-phone download-phone--role" src={screens.role} alt="Choose a SerbiSure role" />
              <img className="download-phone download-phone--explore" src={screens.angledExplore} alt="Find kasambahay with SerbiSure" />
            </div>
            <div className="download-copy">
              <h2>Find Help or Find Work<br />with SerbiSure</h2>
              <p>Create your account, choose your role, and connect with the right people for safer and more organized household work.</p>
              <div className="cta-actions">
                <button className="download-button download-button--light" type="button" onClick={handleDownload}>
                  <Download size={17} /> Download APK
                </button>
                <button className="download-button download-button--qr-dark" type="button" onClick={() => setIsQrModalOpen(true)}>
                  <QrCode size={17} /> Scan with QR
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-shell footer-layout">
          <a className="footer-brand" href="#home" aria-label="SerbiSure home">
            <img src="/serbisure-logo.png" alt="" />
            <div>
              <span className="footer-brand__name">Serbi<strong>Sure</strong></span>
              <p>Trusted help for your home.</p>
            </div>
          </a>
          <nav aria-label="Footer navigation"><a href="#faqs">Support</a><a href="#">Privacy &amp; Policy</a><a href="#">Terms &amp; Conditions</a></nav>
          <small>©2026 SerbiSure. All rights reserved</small>
        </div>
      </footer>

      {isQrModalOpen && (
        <div
          className="qr-modal-backdrop"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsQrModalOpen(false);
          }}
        >
          <div className="qr-modal" role="dialog" aria-modal="true" aria-labelledby="qr-modal-title">
            <div className="qr-modal__top">
              <div className="qr-modal__brand">
                <img src="/serbisure-logo.png" alt="" />
                <span>Serbi<strong>Sure</strong></span>
              </div>
              <button
                ref={closeQrBtnRef}
                className="qr-modal__close"
                type="button"
                aria-label="Close QR code modal"
                onClick={() => setIsQrModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="qr-modal__body">
              <div className="qr-modal__frame">
                <QrCodeSvg value={qrTargetUrl} />
              </div>
              <h3 id="qr-modal-title">Scan to Get SerbiSure</h3>
              <p>Open your Android phone’s camera and scan this QR code to download the SerbiSure APK.</p>
              <button
                className="download-button download-button--dark qr-modal__cta"
                type="button"
                onClick={() => {
                  setIsQrModalOpen(false);
                  handleDownload();
                }}
              >
                <Download size={17} /> Download APK Directly
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`download-toast ${showDownloadNote ? 'download-toast--visible' : ''}`} role="status" aria-live="polite">APK release is coming soon.</div>
    </div>
  );
};
