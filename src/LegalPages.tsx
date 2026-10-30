import React from 'react';

export type PageRoute = 'home' | 'support' | 'privacy' | 'terms';

interface LegalDocProps {
  onNavigate: (route: PageRoute) => void;
}

export const PrivacyPolicyDoc: React.FC<LegalDocProps> = () => (
  <article className="legal-doc">
    <h1>Privacy Policy</h1>
    <p className="legal-doc__meta">Last updated: October 2026</p>

    <p>
      At SerbiSure, we value your trust and are dedicated to safeguarding your personal data. This
      Privacy Policy describes our practices regarding the collection, processing, and protection of
      information gathered through the SerbiSure mobile application, in compliance with Republic Act
      No. 10173, otherwise known as the <strong>Data Privacy Act of 2012 (DPA)</strong> of the
      Philippines.
    </p>

    <h2>1. Information We Collect</h2>
    <p>
      We collect personal information necessary to deliver trusted matching services between
      Homeowners and Kasambahays:
    </p>
    <ul>
      <li>
        <strong>Account Credentials:</strong> Full name, mobile phone number, email address,
        password hash, and account type.
      </li>
      <li>
        <strong>Identity Documents:</strong> National ID (PhilSys), NBI Clearances, Police
        Clearances, and facial liveness verification photos.
      </li>
      <li>
        <strong>Service Data:</strong> Job posts, service requests, booking histories, location
        (city/province), and ratings/reviews.
      </li>
      <li>
        <strong>Resumes &amp; Credentials:</strong> CVs are generated from saved profile details.
        Experience and training are self-reported. Workers choose whether phone numbers and family
        details appear on shared CVs.
      </li>
    </ul>

    <h2>2. How We Use Information</h2>
    <p>Your data is collected strictly for legitimate platform purposes:</p>
    <ul>
      <li>
        <strong>Verification Screening:</strong> Validating government-issued IDs with OCR and
        administrative review to safeguard community safety.
      </li>
      <li>
        <strong>Matching &amp; Connection:</strong> Displaying verified profiles, service
        categories, and contact availability.
      </li>
      <li>
        <strong>Trust &amp; Quality Assurance:</strong> Aggregating feedback and computing
        transparent sentiment ratings to prevent abuse.
      </li>
    </ul>

    <h2>3. Security &amp; Storage</h2>
    <p>We implement robust technical and organizational measures:</p>
    <ul>
      <li>
        All communications between your mobile device and our backend servers are encrypted using
        modern Transport Layer Security (TLS/HTTPS).
      </li>
      <li>
        Clearance documents and verification media are stored on secure, authenticated object
        storage with restricted administrative access.
      </li>
      <li>
        Account passwords are salted and hashed using industry-standard cryptography; passwords are
        never stored in plain text.
      </li>
    </ul>

    <h2>4. Barangay Workforce Analytics</h2>
    <p>
      SerbiSure may compile aggregated and anonymized demographic, employment-status, and
      service-category statistics to support local government monitoring and the Batas Kasambahay
      under RA 10361 and DILG MC 2013-61.
    </p>
    <p>
      These analytics are available only to authorized Barangay officials and System Administrators.
      Public users and Homeowners do not receive identity-level workforce reports.
    </p>
    <p>
      NBI and Police Clearances remain confidential and are visible only to the USTP Superadmin and
      designated Barangay Desk Officers. They are never publicly visible to Homeowners.
    </p>

    <h2>5. Third-Party Processors and Cloud Services</h2>
    <p>
      To operate the platform, selected service providers process information on SerbiSure&apos;s
      behalf under access controls and security requirements:
    </p>
    <ul>
      <li>
        <strong>Cloudinary:</strong> stores uploaded identity documents, clearance images, and
        verification media.
      </li>
      <li>
        <strong>Neon PostgreSQL:</strong> stores account, profile, booking, and review records.
      </li>
      <li>
        <strong>Hugging Face XLM-RoBERTa:</strong> processes written reviews to produce sentiment
        labels.
      </li>
      <li>
        <strong>Cloud OCR service:</strong> extracts text from submitted identity and clearance
        documents for assisted review.
      </li>
    </ul>

    <h2>6. Biometric Data and Facial Liveness</h2>
    <p>
      The MediaPipe liveness check uses facial landmarks to confirm physical presence during
      verification. A captured selfie may be cross-referenced with the submitted government ID for
      identity confirmation only.
    </p>
    <p>
      Facial verification media is sensitive personal information. It is restricted to verification
      purposes, is never sold, and is not shared with third parties for advertising or unrelated
      profiling.
    </p>

    <h2>7. Retention and Disposal</h2>
    <p>
      Verification documents, liveness media, and account records are retained only for as long as
      needed for verification, safety, legal compliance, and documented platform operations.
    </p>
    <p>
      Expired or rejected clearances are marked for review and disposal according to applicable
      retention requirements. When an account is terminated, records are deleted or anonymized when
      there is no legal or safety reason to retain them.
    </p>

    <h2>8. Your Rights Under RA 10173</h2>
    <p>As a registered user, you retain the following statutory rights:</p>
    <ul>
      <li>
        <strong>Right to be Informed:</strong> Knowing how your personal data is collected and
        processed.
      </li>
      <li>
        <strong>Right to Access:</strong> Requesting a copy of your personal data held by SerbiSure.
      </li>
      <li>
        <strong>Right to Rectification:</strong> Correcting outdated, inaccurate, or incomplete
        information.
      </li>
      <li>
        <strong>Right to Erasure:</strong> Requesting the deletion of your account and related
        records.
      </li>
    </ul>

    <h2>9. Contact Data Protection Officer</h2>
    <p>
      For inquiries, data access requests, or privacy concerns, please contact our Data Protection
      Officer at{' '}
      <a href="mailto:privacy@serbisure.ph?subject=Privacy%20Inquiry">privacy@serbisure.ph</a>.
    </p>
  </article>
);

export const TermsOfUseDoc: React.FC<LegalDocProps> = ({ onNavigate }) => (
  <article className="legal-doc">
    <h1>Terms of Use</h1>
    <p className="legal-doc__meta">Last updated: October 2026</p>

    <p>
      By creating a SerbiSure account, you agree to these Terms of Service and confirm that you have
      read our{' '}
      <a
        href="/privacy"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('privacy');
        }}
      >
        Data Privacy Policy
      </a>
      .
    </p>

    <h2>1. Eligibility and Account Responsibility</h2>
    <p>
      You must provide accurate information, keep your account credentials secure, and be at least
      18 years old to use SerbiSure.
    </p>

    <h2>2. Using the Platform</h2>
    <p>
      SerbiSure helps Homeowners and Kasambahays discover services, communicate, and arrange
      bookings. You are responsible for the information and messages you share.
    </p>

    <h2>3. Verification and Safety</h2>
    <p>
      Verification supports trust on the platform but does not guarantee a user&apos;s identity,
      qualifications, conduct, or the outcome of a booking. Use your own judgment and follow
      applicable safety guidance.
    </p>
    <p>
      Homeowners must submit a valid PhilSys National ID. Kasambahays must submit valid NBI and PNP
      Clearances. Counterfeit, borrowed, altered, or expired credentials may result in immediate
      suspension and reporting to the proper authorities.
    </p>

    <h2>4. Bookings, Payments, and Reviews</h2>
    <p>
      Users are responsible for agreeing on service details, schedules, rates, and payment
      arrangements. Reviews must be honest, relevant, and based on a real interaction.
    </p>
    <p>
      Short-term on-demand bookings between the same Homeowner and Kasambahay are limited to three
      (3) bookings per calendar month. Reaching the cap triggers a programmatic block and requires
      the parties to consider a formal long-term contract so recurring work is not misclassified as
      gig work.
    </p>
    <p>
      After a completed engagement, users must submit a review. Reviews written in English,
      Filipino, Bisaya, or Taglish may be evaluated by an automated XLM-RoBERTa sentiment model to
      produce public Positive, Neutral, or Negative labels.
    </p>

    <h2>5. Wage Floor and Platform Role</h2>
    <p>
      Job offers and booking compensation must meet or exceed the applicable RTWPB-10 minimum wage
      floor for Northern Mindanao and Cagayan de Oro City. Offering below the applicable minimum,
      including through an off-platform arrangement connected to SerbiSure, violates these Terms.
    </p>
    <p>
      SerbiSure is a technology facilitator and matching marketplace. It is not a Private Employment
      Agency, employer, or party to the employment contract between a Homeowner and Kasambahay.
      SerbiSure does not handle payroll, direct wage disbursement, or statutory benefit
      contributions.
    </p>

    <h2>6. Scope and Safety Boundaries</h2>
    <p>
      SerbiSure does not perform medical or mental-fitness evaluations, physical deployment, dispute
      arbitration, or legal mediation. Homeowners are responsible for requesting standard health
      certificates directly when required. Disputes remain subject to the appropriate Barangay Lupon
      or DOLE process.
    </p>

    <h2>7. Required Credentials and Reviews</h2>
    <p>
      Submitting a counterfeit, borrowed, altered, or expired government credential is fraudulent
      conduct. It may lead to immediate profile suspension and referral to local authorities.
      Reviews must describe a real completed engagement and must not expose another person&apos;s
      confidential documents or personal information.
    </p>

    <h2>8. Prohibited Conduct</h2>
    <p>
      Do not impersonate another person, submit false documents, harass other users, misuse personal
      data, or use SerbiSure for unlawful activity.
    </p>

    <h2>9. Account Changes or Suspension</h2>
    <p>
      We may limit or suspend access when needed to protect users, investigate violations, or comply
      with law. You may stop using the service at any time.
    </p>

    <h2>10. Contact and Acceptance</h2>
    <p>
      If you have questions about these terms, contact{' '}
      <a
        href="/support"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('support');
        }}
      >
        SerbiSure Support
      </a>{' '}
      at <a href="mailto:support@serbisure.ph?subject=Terms%20Inquiry">support@serbisure.ph</a>. By
      creating an account or tapping Accept in the app, you confirm that you understand and accept
      these Terms of Service.
    </p>
  </article>
);

export const SupportDoc: React.FC<LegalDocProps> = ({ onNavigate }) => (
  <article className="legal-doc">
    <h1>Support</h1>
    <p className="legal-doc__meta">Help, verification guidance, and contact channels</p>

    <p>
      SerbiSure connects Homeowners and Kasambahays for safer, fairer, and better-organized
      household work under Republic Act No. 10361 (Batas Kasambahay). If you need assistance with
      your account, verification, or bookings, reach us through the channels below.
    </p>

    <h2>1. Contact Channels</h2>
    <ul>
      <li>
        <strong>General Support:</strong>{' '}
        <a href="mailto:support@serbisure.ph?subject=SerbiSure%20Support%20Inquiry">
          support@serbisure.ph
        </a>
      </li>
      <li>
        <strong>Data Protection Officer (Privacy Inquiries):</strong>{' '}
        <a href="mailto:privacy@serbisure.ph?subject=Privacy%20Inquiry">privacy@serbisure.ph</a>
      </li>
      <li>
        <strong>Project Base:</strong> Department of Information Technology, College of Information
        and Computing, University of Science and Technology of Southern Philippines (USTP), Cagayan
        de Oro City, Misamis Oriental, Philippines.
      </li>
    </ul>

    <h2>2. In-App Support &amp; Barangay Desk</h2>
    <ul>
      <li>
        <strong>SerbiSure Support Chat:</strong> Signed-in Homeowners and Kasambahays can open{' '}
        <strong>Messages → Need help?</strong> inside the mobile app and select{' '}
        <strong>SerbiSure Support</strong> to message a platform administrator directly.
      </li>
      <li>
        <strong>Your Barangay Desk:</strong> Verified residents in participating barangays can also
        reach their active <strong>Barangay Desk Officer</strong> under{' '}
        <strong>Messages → Need help?</strong> for local kasambahay assistance and community
        inquiries.
      </li>
    </ul>

    <h2>3. Verification Assistance</h2>
    <ul>
      <li>
        <strong>Homeowners:</strong> Prepare a clear, unexpired <strong>PhilSys National ID</strong>{' '}
        and complete the guided facial liveness check under <strong>Profile → Get Verified</strong>.
      </li>
      <li>
        <strong>Kasambahays:</strong> Prepare valid <strong>NBI and PNP Clearances</strong> and
        complete facial liveness verification. Uploaded clearances remain strictly confidential and
        are never publicly shown on your profile.
      </li>
      <li>
        <strong>Action Needed Status:</strong> If a document was flagged as blurry, expired, or
        mismatched, open <strong>Profile → Get Verified</strong> to review the note and resubmit a
        clear photo.
      </li>
    </ul>

    <h2>4. Bookings, Wages, and Workplace Disputes</h2>
    <ul>
      <li>
        <strong>Short-Term &amp; Long-Term Work:</strong> Short-term on-demand bookings between the
        same Homeowner and Kasambahay are capped at three (3) per calendar month to encourage proper
        long-term contracts for recurring household employment.
      </li>
      <li>
        <strong>Minimum Wage Floor:</strong> All offers and bookings must meet or exceed the
        applicable RTWPB-10 wage floor for Northern Mindanao and Cagayan de Oro City.
      </li>
      <li>
        <strong>Dispute Resolution:</strong> Because SerbiSure is a technology matching facilitator
        and not an employer or agency, employment or workplace disputes should be referred to your
        local <strong>Barangay Lupon</strong> or the <strong>Department of Labor and Employment (DOLE)</strong>.
      </li>
    </ul>

    <h2>5. Privacy &amp; Account Controls</h2>
    <p>
      You can toggle phone number visibility anytime in the app under{' '}
      <strong>Profile → Preferences → Show Contact Number</strong>, or switch interface languages
      between English, Tagalog, and Bisaya. To request a copy or deletion of your account data under
      RA 10173, email{' '}
      <a href="mailto:privacy@serbisure.ph?subject=Account%20Data%20Request">
        privacy@serbisure.ph
      </a>
      . For full details, see our{' '}
      <a
        href="/privacy"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('privacy');
        }}
      >
        Privacy Policy
      </a>{' '}
      and{' '}
      <a
        href="/terms"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('terms');
        }}
      >
        Terms of Use
      </a>
      .
    </p>
  </article>
);

