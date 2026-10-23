"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Counter({
  end,
  suffix = "",
  decimals = 0,
  duration = 1800,
}: {
  end: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const { ref, visible } = useReveal();

  useEffect(() => {
    if (!visible) return;

    let startTime: number | null = null;
    let frame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(end * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setValue(end);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [visible, end, duration]);

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function Reveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
}) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className={`ck-reveal ck-${direction} ${
        visible ? "ck-visible" : ""
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const services = [
  "Deep Car Washing",
  "Car Interior Cleaning",
  "Kitchen Cleaning",
  "Carpet Cleaning",
  "Sofa Dry Cleaning",
  "Bike Foam Wash",
];

export default function AboutPage() {
  return (
    <main className="ck-page">

      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="ck-about-hero">
        <div className="ck-container ck-hero-inner">

          <Reveal direction="left">
            <div>
              <div className="ck-eyebrow">
                <span />
                <span>About CleanKart</span>
              </div>

              <h1>
                Professional cleaning,
                <br />
                <strong>made simple.</strong>
              </h1>

              <p>
                CleanKart makes it easier to keep your home and vehicle
                clean, fresh and well cared for. We bring convenient
                professional cleaning services right to your doorstep.
              </p>

              <div className="ck-buttons">
                <Link href="/services" className="ck-primary-btn">
                  Explore Services
                  <span>→</span>
                </Link>

                <Link href="/contact" className="ck-secondary-btn">
                  Contact Us
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={180}>
            <div className="ck-hero-image-wrap">
              <Image
                src="/images/services/sofa-steam-cleaning.jpeg"
                alt="CleanKart professional cleaning"
                fill
                priority
                className="ck-cover-image"
                sizes="(max-width: 900px) 100vw, 50vw"
              />

              <div className="ck-hero-overlay" />

              <div className="ck-hero-label">
                <small>THE CLEANKART PROMISE</small>
                <strong>Good care, right at your doorstep.</strong>
              </div>
            </div>
          </Reveal>

        </div>
      </section>


      {/* =========================================================
          WHO WE ARE + PERSON ANIMATION
      ========================================================== */}

      <section className="ck-who-section">
        <div className="ck-world-pattern" />

        <div className="ck-container ck-who-grid">

          <Reveal direction="left">
            <div className="ck-who-content">

              <div className="ck-eyebrow">
                <span />
                <span>Who We Are?</span>
              </div>

              <h2>
                Gives you quality services at the
                <strong> best prices.</strong>
              </h2>

              <p>
                We deliver top-notch cleaning and detailing services at
                prices you can trust. From doorstep car washing to home
                care, CleanKart ensures quality without compromise.
              </p>

              <div className="ck-review-grid">

                {/* REVIEW CARD */}
                <Reveal direction="left" delay={200}>
                  <div className="ck-rating-card">

                    <div className="ck-rating-number">
                      <Counter
                        end={4.7}
                        decimals={1}
                        suffix="+"
                        duration={2200}
                      />
                    </div>

                    <div className="ck-stars">
                      ★★★★★
                    </div>

                    <div className="ck-rating-title">
                      Review Customer
                    </div>

                    <p>
                      Real feedback from satisfied CleanKart users
                    </p>

                  </div>
                </Reveal>


                {/* QUALITY CARD */}
                <Reveal direction="right" delay={350}>
                  <div className="ck-rating-card">

                    <div className="ck-rating-number">
                      <Counter
                        end={4.8}
                        decimals={1}
                        suffix="+"
                        duration={2400}
                      />
                    </div>

                    <div className="ck-stars">
                      ★★★★★
                    </div>

                    <div className="ck-rating-title">
                      Quality Score
                    </div>

                    <p>
                      Consistently rated for premium service experience
                    </p>

                  </div>
                </Reveal>

              </div>
            </div>
          </Reveal>


          {/* PERSON */}
          <Reveal direction="right" delay={250}>
            <div className="ck-person-area">

              <div className="ck-yellow-circle" />

              <div className="ck-top-badge">
                <strong>#1</strong>
                <span>Top Company</span>
              </div>

              {/*
                IMPORTANT:
                Put your CleanKart transparent person PNG here:

                frontend/public/images/about/cleankart-person.png

                If your PNG has a different filename, change the src below.
              */}

              <div className="ck-person">

                <Image
                  src="/images/about/cleankart-person.png"
                  alt="CleanKart professional"
                  fill
                  className="ck-person-image"
                  sizes="420px"
                />

              </div>

            </div>
          </Reveal>

        </div>
      </section>


      {/* =========================================================
          LARGE IMAGE / AFFORDABILITY
      ========================================================== */}

      <section className="ck-large-image-section">
        <div className="ck-container">

          <Reveal direction="scale">

            <div className="ck-large-image">

              <Image
                src="/images/services/sofa-steam-cleaning.jpeg"
                alt="Professional CleanKart service"
                fill
                className="ck-cover-image ck-zoom-image"
                sizes="100vw"
              />

              <div className="ck-dark-overlay" />

              <div className="ck-large-content">

                <h2>
                  Exceptional Cleaning Service
                  <br />
                  Delivered with Affordability
                </h2>

                <p>
                  We bring certified cleaning and detailing services
                  right to your doorstep, without the high costs.
                </p>

              </div>

            </div>

          </Reveal>

        </div>
      </section>


      {/* =========================================================
          VISION / MISSION
      ========================================================== */}

      <section className="ck-mission-section">

        <div className="ck-container">

          <div className="ck-mission-grid">

            <Reveal direction="left">
              <div className="ck-info-card">

                <div className="ck-info-icon">
                  ◉
                </div>

                <h3>Our Vision</h3>

                <p>
                  To become India's most trusted brand for doorstep
                  car washing and home cleaning services by delivering
                  unmatched quality, convenience and customer
                  satisfaction — right at every doorstep we serve.
                </p>

              </div>
            </Reveal>


            <Reveal direction="right" delay={150}>
              <div className="ck-info-card">

                <div className="ck-info-icon">
                  ◎
                </div>

                <h3>Our Mission</h3>

                <p>
                  To simplify everyday cleaning through expert-led,
                  doorstep car washing and home care services —
                  ensuring every customer enjoys professional results,
                  fair pricing and a hassle-free experience.
                </p>

              </div>
            </Reveal>

          </div>

        </div>

      </section>


      {/* =========================================================
          TEAM / SMART CLEANING
      ========================================================== */}

      <section className="ck-team-banner">

        <Image
          src="/images/services/sofa-steam-cleaning.jpeg"
          alt="CleanKart team"
          fill
          className="ck-cover-image"
          sizes="100vw"
        />

        <div className="ck-dark-overlay strong" />

        <div className="ck-container ck-team-content">

          <Reveal direction="left">

            <h2>
              Smart Cleaning Starts at
              <br />
              <strong>Your Doorstep</strong>
            </h2>

            <p>
              Enjoy expert-led doorstep car washing and home cleaning
              services with certified quality, trusted professionals
              and unmatched convenience.
            </p>

            <Link href="/services" className="ck-yellow-btn">
              Book Now
            </Link>

          </Reveal>

        </div>

      </section>


      {/* =========================================================
          NUMBERS SECTION
      ========================================================== */}

      <section className="ck-numbers-section">

        <div className="ck-container ck-numbers-grid">

          <Reveal direction="left">

            <div className="ck-yellow-panel">

              <h2>
                Expert cleaning services delivered
                <br />
                at your doorstep
              </h2>

              <p>
                Enjoy professional cleaning services without
                stepping out of your home. Our trained experts
                handle everything from doorstep car washing to
                deep sofa and AC cleaning.
              </p>

              <div className="ck-benefits">

                <span>✓ Certified experts at your doorstep</span>
                <span>✓ Hassle-free car and home cleaning</span>
                <span>✓ Trusted by customers across India</span>
                <span>✓ Affordable, transparent pricing</span>

              </div>

            </div>

          </Reveal>


          <div className="ck-stat-column">

            <Reveal direction="right">
              <div className="ck-stat-card">

                <div>
                  <strong>
                    <Counter end={15} suffix="K+" duration={1800} />
                  </strong>
                  <span>Services Completed</span>
                </div>

                <div className="ck-stat-divider" />

                <div>
                  <strong>
                    <Counter end={20} suffix="K+" duration={2000} />
                  </strong>
                  <span>Happy Customers</span>
                </div>

              </div>
            </Reveal>


            <Reveal direction="right" delay={150}>
              <div className="ck-small-image">

                <Image
                  src="/images/services/kitchen-cleaning.jpeg"
                  alt="CleanKart service"
                  fill
                  className="ck-cover-image"
                />

              </div>
            </Reveal>


            <Reveal direction="right" delay={300}>
              <div className="ck-google-card">

                <strong>
                  <Counter
                    end={4.7}
                    decimals={1}
                    suffix="+"
                    duration={2200}
                  />
                </strong>

                <div>
                  <div className="ck-stars">
                    ★★★★★
                  </div>
                  <span>
                    Trusted customer reviews
                  </span>
                </div>

              </div>
            </Reveal>

          </div>

        </div>

      </section>


      {/* =========================================================
          PROMISE + PROGRESS
      ========================================================== */}

      <section className="ck-promise-section">

        <div className="ck-container ck-promise-grid">

          <div className="ck-promise-left">

            <Reveal direction="left">

              <div className="ck-promise-image">

                <Image
                  src="/images/services/sofa-steam-cleaning.jpeg"
                  alt="CleanKart professionals"
                  fill
                  className="ck-cover-image"
                />

              </div>

            </Reveal>


            <Reveal direction="left" delay={150}>

              <div className="ck-white-info">

                <h3>Our Promise</h3>

                <p>
                  We commit to delivering reliable, high-quality
                  doorstep cleaning services that exceed
                  expectations — every time, for every customer.
                </p>

              </div>

            </Reveal>


            <Reveal direction="left" delay={300}>

              <div className="ck-white-info">

                <h3>Our Commitment</h3>

                <p>
                  We are committed to reliable, expert-led
                  doorstep cleaning. From car washing to home care,
                  we deliver quality with care.
                </p>

              </div>

            </Reveal>

          </div>


          <Reveal direction="right">

            <div className="ck-progress-panel">

              <h2>
                Affordable pricing, premium
                <br />
                quality guaranteed
              </h2>

              <p>
                At CleanKart, we believe professional cleaning
                should be accessible to everyone — without
                compromising on quality. That's why we offer
                affordable pricing on all our services, from
                doorstep car washing to sofa dry cleaning and
                interior detailing.
              </p>


              <ProgressBar
                title="Satisfaction"
                value={98}
                delay={400}
              />

              <ProgressBar
                title="Affordable"
                value={95}
                delay={600}
              />

              <ProgressBar
                title="Reliable"
                value={92}
                delay={800}
              />

            </div>

          </Reveal>

        </div>

      </section>


      {/* =========================================================
          SERVICES
      ========================================================== */}

      <section className="ck-services-section">

        <div className="ck-container">

          <Reveal direction="up">

            <div className="ck-section-heading">

              <div className="ck-eyebrow center">
                <span />
                <span>What We Do</span>
                <span />
              </div>

              <h2>
                One place for your
                <strong> cleaning needs.</strong>
              </h2>

              <p>
                From homes to vehicles, CleanKart offers practical
                cleaning services designed to make your space look
                and feel its best.
              </p>

            </div>

          </Reveal>


          <div className="ck-service-grid">

            {services.map((service, index) => (

              <Reveal
                key={service}
                direction={index % 2 === 0 ? "left" : "right"}
                delay={index * 80}
              >

                <Link
                  href="/services"
                  className="ck-service-card"
                >

                  <span className="ck-service-number">
                    0{index + 1}
                  </span>

                  <span>{service}</span>

                  <b>→</b>

                </Link>

              </Reveal>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          FINAL CTA
      ========================================================== */}

      <section className="ck-final-cta">

        <Reveal direction="scale">

          <div className="ck-container">

            <div className="ck-cta-box">

              <small>READY FOR A CLEANER SPACE?</small>

              <h2>
                Let CleanKart take care
                <br />
                of the cleaning.
              </h2>

              <p>
                Choose your service, pick what works for you and
                enjoy professional cleaning at your doorstep.
              </p>

              <Link href="/services" className="ck-yellow-btn">
                Book a Service →
              </Link>

            </div>

          </div>

        </Reveal>

      </section>


      {/* =========================================================
          FLOATING WHATSAPP
      ========================================================== */}

      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="ck-whatsapp"
        aria-label="Contact CleanKart on WhatsApp"
      >
        <span>◔</span>
      </a>


      {/* =========================================================
          PAGE CSS
      ========================================================== */}

      <style jsx global>{`

        * {
          box-sizing: border-box;
        }

        .ck-page {
          width: 100%;
          overflow: hidden;
          background: #ffffff;
          color: #101828;
          font-family: Arial, Helvetica, sans-serif;
        }

        .ck-container {
          width: min(1380px, calc(100% - 100px));
          margin: 0 auto;
        }

        /* =========================================
           REVEAL ANIMATIONS
        ========================================== */

        .ck-reveal {
          opacity: 0;
          transition:
            opacity 900ms cubic-bezier(.22,1,.36,1),
            transform 900ms cubic-bezier(.22,1,.36,1);
        }

        .ck-up {
          transform: translateY(70px);
        }

        .ck-left {
          transform: translateX(-110px);
        }

        .ck-right {
          transform: translateX(110px);
        }

        .ck-scale {
          transform: scale(.88);
        }

        .ck-visible {
          opacity: 1;
          transform: translate(0) scale(1);
        }

        /* =========================================
           HERO
        ========================================== */

        .ck-about-hero {
          background: #f0f6ff;
          padding: 85px 0;
        }

        .ck-hero-inner {
          display: grid;
          grid-template-columns: 1fr .9fr;
          align-items: center;
          gap: 70px;
        }

        .ck-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
          font-size: 15px;
          font-weight: 600;
          color: #1769e8;
        }

        .ck-eyebrow span:first-child {
          width: 155px;
          height: 2px;
          background: #1769e8;
        }

        .ck-eyebrow.center {
          justify-content: center;
        }

        .ck-about-hero h1 {
          margin: 0;
          color: #1769e8;
          font-size: clamp(44px, 5vw, 72px);
          line-height: .98;
          letter-spacing: -3px;
          font-weight: 800;
        }

        .ck-about-hero h1 strong {
          color: #1769e8;
        }

        .ck-about-hero p {
          max-width: 700px;
          margin: 28px 0 0;
          font-size: 18px;
          line-height: 1.7;
          color: #475467;
        }

        .ck-buttons {
          display: flex;
          gap: 15px;
          margin-top: 35px;
          flex-wrap: wrap;
        }

        .ck-primary-btn,
        .ck-secondary-btn,
        .ck-yellow-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-height: 50px;
          padding: 0 27px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 700;
          transition: .3s ease;
        }

        .ck-primary-btn {
          background: #1769e8;
          color: #ffffff;
        }

        .ck-primary-btn:hover {
          background: #102c5f;
          transform: translateY(-3px);
        }

        .ck-secondary-btn {
          border: 1px solid #1769e8;
          color: #1769e8;
          background: #ffffff;
        }

        .ck-secondary-btn:hover {
          background: #1769e8;
          color: white;
        }

        .ck-hero-image-wrap {
          position: relative;
          min-height: 470px;
          overflow: hidden;
          border-radius: 30px;
        }

        .ck-cover-image {
          object-fit: cover;
        }

        .ck-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,.65),
            transparent 60%
          );
        }

        .ck-hero-label {
          position: absolute;
          left: 28px;
          right: 28px;
          bottom: 28px;
          color: white;
        }

        .ck-hero-label small {
          display: block;
          color: #f4c542;
          font-size: 11px;
          letter-spacing: 2px;
          font-weight: 800;
        }

        .ck-hero-label strong {
          display: block;
          margin-top: 8px;
          font-size: 25px;
        }

        /* =========================================
           WHO WE ARE
        ========================================== */

        .ck-who-section {
          position: relative;
          padding: 110px 0 80px;
          overflow: hidden;
        }

        .ck-world-pattern {
          position: absolute;
          inset: 0;
          opacity: .07;
          background-image: radial-gradient(
            #1769e8 1.5px,
            transparent 1.5px
          );
          background-size: 11px 11px;
          mask-image: linear-gradient(
            90deg,
            black,
            transparent 70%
          );
          pointer-events: none;
        }

        .ck-who-grid {
          position: relative;
          display: grid;
          grid-template-columns: 1.2fr .8fr;
          align-items: center;
          gap: 50px;
        }

        .ck-who-content h2 {
          max-width: 760px;
          margin: 0;
          color: #1769e8;
          font-size: clamp(42px, 5vw, 66px);
          line-height: 1.02;
          letter-spacing: -2px;
        }

        .ck-who-content h2 strong {
          display: block;
          color: #1769e8;
        }

        .ck-who-content > p {
          max-width: 850px;
          margin: 28px 0 0;
          color: #344054;
          font-size: 17px;
          line-height: 1.7;
        }

        .ck-review-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 40px;
        }

        .ck-rating-card {
          min-height: 175px;
          padding: 25px;
          text-align: center;
          border: 1px solid #b8cdf5;
          border-radius: 9px;
          background: rgba(255,255,255,.88);
          transition: .35s ease;
        }

        .ck-rating-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 18px 40px rgba(23,105,232,.13);
        }

        .ck-rating-number {
          font-size: 38px;
          font-weight: 800;
          color: #111111;
        }

        .ck-stars {
          color: #f4c542;
          font-size: 20px;
          letter-spacing: 2px;
        }

        .ck-rating-title {
          margin-top: 4px;
          font-size: 20px;
          color: #1769e8;
          font-weight: 600;
        }

        .ck-rating-card p {
          margin: 8px 0 0;
          font-size: 14px;
          color: #344054;
        }

        /* =========================================
           PERSON
        ========================================== */

        .ck-person-area {
          position: relative;
          height: 560px;
        }

        .ck-yellow-circle {
          position: absolute;
          width: 390px;
          height: 390px;
          left: 50%;
          top: 100px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: #f4c542;
        }

        .ck-person {
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 390px;
          height: 500px;
          transform: translateX(-50%);
        }

        .ck-person-image {
          object-fit: contain;
          object-position: bottom center;
        }

        .ck-top-badge {
          position: absolute;
          top: 0;
          right: 0;
          z-index: 3;
          width: 185px;
          height: 185px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #1769e8;
          box-shadow: 0 15px 35px rgba(0,0,0,.15);
        }

        .ck-top-badge strong {
          color: #f4c542;
          font-size: 27px;
        }

        .ck-top-badge span {
          margin-top: 7px;
          color: #102c5f;
          font-size: 15px;
          font-weight: 600;
        }

        /* =========================================
           LARGE IMAGE
        ========================================== */

        .ck-large-image-section {
          padding: 25px 0 80px;
        }

        .ck-large-image {
          position: relative;
          height: 590px;
          overflow: hidden;
          border-radius: 22px;
        }

        .ck-zoom-image {
          transition: transform 1.2s ease;
        }

        .ck-large-image:hover .ck-zoom-image {
          transform: scale(1.04);
        }

        .ck-dark-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,.58);
        }

        .ck-dark-overlay.strong {
          background: rgba(0,0,0,.63);
        }

        .ck-large-content {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          text-align: center;
          color: white;
        }

        .ck-large-content h2 {
          margin: 0;
          color: #f4c542;
          font-size: clamp(38px, 5vw, 62px);
          line-height: 1.05;
        }

        .ck-large-content p {
          max-width: 850px;
          margin: 35px auto 0;
          font-size: 17px;
        }

        /* =========================================
           MISSION
        ========================================== */

        .ck-mission-section {
          padding: 20px 0 90px;
        }

        .ck-mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .ck-info-card {
          padding: 32px;
          border: 1px solid #b8cdf5;
          border-radius: 8px;
          background: white;
        }

        .ck-info-icon {
          width: 55px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #1769e8;
          border-radius: 50%;
          color: #1769e8;
          font-size: 24px;
        }

        .ck-info-card h3 {
          margin: 22px 0 10px;
          color: #1769e8;
          font-size: 27px;
        }

        .ck-info-card p {
          margin: 0;
          color: #344054;
          line-height: 1.7;
        }

        /* =========================================
           TEAM
        ========================================== */

        .ck-team-banner {
          position: relative;
          min-height: 510px;
          display: flex;
          align-items: center;
        }

        .ck-team-content {
          position: relative;
          z-index: 2;
        }

        .ck-team-content h2 {
          margin: 0;
          color: #f4c542;
          font-size: clamp(43px, 5vw, 68px);
          line-height: 1.02;
        }

        .ck-team-content p {
          max-width: 800px;
          margin: 25px 0;
          color: white;
          font-size: 17px;
          line-height: 1.7;
        }

        .ck-yellow-btn {
          background: #f4c542;
          color: #101010;
        }

        .ck-yellow-btn:hover {
          background: #ffffff;
          transform: translateY(-3px);
        }

        /* =========================================
           NUMBERS
        ========================================== */

        .ck-numbers-section {
          padding: 90px 0;
        }

        .ck-numbers-grid {
          display: grid;
          grid-template-columns: 1.5fr .75fr;
          gap: 20px;
        }

        .ck-yellow-panel {
          padding: 55px;
          border: 1px solid #1769e8;
          border-radius: 12px;
          background: #f4c542;
        }

        .ck-yellow-panel h2 {
          margin: 0;
          color: #1769e8;
          font-size: clamp(39px, 4.5vw, 60px);
          line-height: 1.05;
        }

        .ck-yellow-panel p {
          max-width: 850px;
          margin: 25px 0;
          color: #344054;
          font-size: 17px;
          line-height: 1.6;
        }

        .ck-benefits {
          display: grid;
          gap: 12px;
          color: #111111;
          font-size: 16px;
          font-weight: 600;
        }

        .ck-stat-column {
          display: grid;
          gap: 18px;
        }

        .ck-stat-card {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          align-items: center;
          min-height: 125px;
          padding: 20px;
          border: 1px solid #b8cdf5;
          border-radius: 12px;
          text-align: center;
        }

        .ck-stat-card strong {
          display: block;
          color: #1769e8;
          font-size: 40px;
        }

        .ck-stat-card span {
          display: block;
          margin-top: 4px;
          font-size: 14px;
        }

        .ck-stat-divider {
          height: 70px;
          background: #344054;
        }

        .ck-small-image {
          position: relative;
          min-height: 255px;
          overflow: hidden;
          border-radius: 12px;
        }

        .ck-google-card {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 25px;
          min-height: 105px;
          border: 1px solid #b8cdf5;
          border-radius: 12px;
        }

        .ck-google-card > strong {
          color: #1769e8;
          font-size: 45px;
        }

        .ck-google-card span {
          font-size: 13px;
        }

        /* =========================================
           PROMISE
        ========================================== */

        .ck-promise-section {
          padding: 30px 0 90px;
        }

        .ck-promise-grid {
          display: grid;
          grid-template-columns: .75fr 1.25fr;
          gap: 30px;
        }

        .ck-promise-left {
          display: grid;
          gap: 20px;
        }

        .ck-promise-image {
          position: relative;
          height: 330px;
          overflow: hidden;
          border-radius: 12px;
        }

        .ck-white-info {
          padding: 25px;
          border: 1px solid #b8cdf5;
          border-radius: 10px;
          background: white;
        }

        .ck-white-info h3 {
          margin: 0 0 5px;
          color: #1769e8;
          font-size: 28px;
        }

        .ck-white-info p {
          margin: 0;
          line-height: 1.55;
        }

        .ck-progress-panel {
          padding: 55px;
          border: 1px solid #d0d5dd;
          border-radius: 13px;
          box-shadow: 0 5px 20px rgba(0,0,0,.08);
        }

        .ck-progress-panel h2 {
          margin: 0;
          color: #1769e8;
          font-size: clamp(38px, 4vw, 58px);
          line-height: 1.05;
        }

        .ck-progress-panel > p {
          margin: 28px 0;
          line-height: 1.65;
          color: #344054;
        }

        .ck-progress {
          margin-top: 25px;
        }

        .ck-progress-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 7px;
          color: #1769e8;
          font-size: 16px;
        }

        .ck-progress-track {
          height: 9px;
          overflow: hidden;
          background: #e9eaec;
        }

        .ck-progress-fill {
          height: 100%;
          width: 0;
          background: #1769e8;
          transition: width 1.5s cubic-bezier(.22,1,.36,1);
        }

        .ck-progress-fill.yellow {
          background: #f4c542;
        }

        .ck-progress-fill.black {
          background: #111111;
        }

        .ck-progress-fill.active {
          width: var(--progress);
        }

        /* =========================================
           SERVICES
        ========================================== */

        .ck-services-section {
          padding: 90px 0;
          background: #f0f6ff;
        }

        .ck-section-heading {
          max-width: 850px;
          margin: 0 auto 50px;
          text-align: center;
        }

        .ck-section-heading h2 {
          margin: 0;
          color: #1769e8;
          font-size: clamp(40px, 4.5vw, 58px);
          line-height: 1.05;
        }

        .ck-section-heading h2 strong {
          color: #1769e8;
        }

        .ck-section-heading p {
          max-width: 700px;
          margin: 20px auto 0;
          color: #475467;
          line-height: 1.7;
        }

        .ck-service-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .ck-service-card {
          display: flex;
          align-items: center;
          gap: 15px;
          min-height: 90px;
          padding: 20px 25px;
          border: 1px solid #b8cdf5;
          border-radius: 12px;
          background: white;
          color: #1769e8;
          text-decoration: none;
          font-weight: 700;
          transition: .35s ease;
        }

        .ck-service-card:hover {
          background: #1769e8;
          color: white;
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(8,123,118,.15);
        }

        .ck-service-number {
          font-size: 13px;
          opacity: .55;
        }

        .ck-service-card b {
          margin-left: auto;
          font-size: 24px;
        }

        /* =========================================
           CTA
        ========================================== */

        .ck-final-cta {
          padding: 0 0 80px;
        }

        .ck-cta-box {
          padding: 80px 30px;
          text-align: center;
          border-radius: 25px;
          background: #1769e8;
          color: white;
        }

        .ck-cta-box small {
          color: #f4c542;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .ck-cta-box h2 {
          margin: 18px 0;
          font-size: clamp(40px, 5vw, 62px);
          line-height: 1.02;
        }

        .ck-cta-box p {
          max-width: 650px;
          margin: 0 auto 30px;
          color: #dbe8ff;
          line-height: 1.7;
        }

        /* =========================================
           WHATSAPP
        ========================================== */

        .ck-whatsapp {
          position: fixed;
          right: 25px;
          bottom: 25px;
          z-index: 100;
          width: 62px;
          height: 62px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #20d466;
          color: white;
          text-decoration: none;
          font-size: 32px;
          box-shadow: 0 10px 30px rgba(0,0,0,.2);
          animation: ck-pulse 2s infinite;
        }

        @keyframes ck-pulse {
          0%, 100% {
            box-shadow: 0 10px 30px rgba(0,0,0,.2);
          }

          50% {
            box-shadow:
              0 10px 30px rgba(0,0,0,.2),
              0 0 0 10px rgba(32,212,102,.12);
          }
        }

        /* =========================================
           RESPONSIVE
        ========================================== */

        @media (max-width: 1000px) {

          .ck-container {
            width: min(100% - 40px, 900px);
          }

          .ck-hero-inner,
          .ck-who-grid,
          .ck-numbers-grid,
          .ck-promise-grid {
            grid-template-columns: 1fr;
          }

          .ck-person-area {
            max-width: 550px;
            width: 100%;
            margin: auto;
          }

          .ck-service-grid {
            grid-template-columns: 1fr 1fr;
          }

        }

        @media (max-width: 650px) {

          .ck-container {
            width: calc(100% - 30px);
          }

          .ck-about-hero {
            padding: 55px 0;
          }

          .ck-about-hero h1 {
            font-size: 45px;
            letter-spacing: -2px;
          }

          .ck-hero-image-wrap {
            min-height: 330px;
          }

          .ck-review-grid,
          .ck-mission-grid,
          .ck-service-grid {
            grid-template-columns: 1fr;
          }

          .ck-who-section {
            padding: 70px 0;
          }

          .ck-who-content h2 {
            font-size: 42px;
          }

          .ck-person-area {
            height: 470px;
          }

          .ck-yellow-circle {
            width: 310px;
            height: 310px;
          }

          .ck-person {
            width: 330px;
            height: 420px;
          }

          .ck-top-badge {
            width: 135px;
            height: 135px;
            right: 0;
          }

          .ck-large-image {
            height: 430px;
          }

          .ck-large-content h2 {
            font-size: 35px;
          }

          .ck-yellow-panel,
          .ck-progress-panel {
            padding: 30px;
          }

          .ck-yellow-panel h2,
          .ck-progress-panel h2 {
            font-size: 38px;
          }

          .ck-stat-card {
            grid-template-columns: 1fr 1px 1fr;
          }

          .ck-stat-card strong {
            font-size: 30px;
          }

          .ck-team-banner {
            min-height: 470px;
          }

          .ck-team-content h2 {
            font-size: 42px;
          }

          .ck-whatsapp {
            right: 15px;
            bottom: 15px;
            width: 56px;
            height: 56px;
          }

        }

      `}</style>

    </main>
  );
}


/* =========================================================
   PROGRESS BAR COMPONENT
========================================================= */

function ProgressBar({
  title,
  value,
  delay,
}: {
  title: string;
  value: number;
  delay: number;
}) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className="ck-progress"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="ck-progress-label">
        <span>{title}</span>
        <strong>{value}%</strong>
      </div>

      <div className="ck-progress-track">
        <div
          className={`ck-progress-fill ${
            title === "Satisfaction"
              ? "yellow"
              : title === "Affordable"
                ? "black"
                : ""
          } ${visible ? "active" : ""}`}
          style={
            {
              "--progress": `${value}%`,
              transitionDelay: `${delay}ms`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}