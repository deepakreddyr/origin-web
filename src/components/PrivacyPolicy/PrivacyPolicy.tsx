import React from 'react';
import { Box, Container } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container
      className="privacy-policy"
      sx={{
        paddingTop: 12,
        paddingBottom: 12,
        fontSize: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        fontFamily: 'SofiaPro',
        '& + .footer': {
          display: 'none'
        },
        h3: {
          fontSize: 20,
          fontWeight: '600',
          paddingTop: 3,
          paddingBottom: 1
        },
        h2: {
          fontSize: 22,
          fontWeight: '600',
          paddingTop: 2,
          paddingBottom: 1
        },
        h4: {
          fontSize: 18,
          fontWeight: '600'
        },
        ul: {
          listStyleType: 'disc',
          paddingLeft: 5
        },
        ol: {
          listStyleType: 'decimal',
          paddingLeft: 5
        },
        p: {
          marginTop: '2rem'
        },

        a: {
          '&:hover': {
            textDecoration: 'underline'
          }
        },
        '@media screen and (max-width: 767px)': {
          paddingTop: 3,
          paddingBottom: 4,
          gap: 2,
          h3: {
            fontSize: 18,
            fontWeight: '600'
          },
          '.content-area, .content-block': {
            gap: 2
          },
          '.content-block': {
            '.content-area': {
              ul: {
                listStyleType: 'disc',
                paddingLeft: 3
              },
              ol: {
                listStyleType: 'decimal',
                paddingLeft: 3
              },

              h4: {
                fontSize: 16,
                fontWeight: '600'
              },
              h2: {
                fontSize: 18,
                fontWeight: '600'
              },
              '*': {
                fontSize: 14
              }
            }
          }
        }
      }}
    >
      <h1
        style={{
          fontSize: '24px',
          fontWeight: '600'
        }}
      >
        Privacy Policy
      </h1>

      <Box className="content-block">
        <h3>1. Introduction</h3>
        <div className="content-area">
          <p>
            Tech7 Phyll Private Limited, a Company incorporated under Companies Act 2013 having its registered office at
            143/1-A, 10th Cross Road, Binnamangala 1st Stage, Indira Nagar, Bangalore, Bangalore, Karnataka, India,
            560038 is the owner of the brand <strong>Origin Fresh</strong> and web-based platform ‘
            <strong>Originfresh.in</strong>’ and mobile application ‘<strong>Origin Fresh</strong>’ (collectively, the
            “Platform”). The ‘Company’ is a Proprietor of the brand Origin Fresh.
          </p>
          <ul>
            <li>Engaging with us in other ways, such as through sales, marketing, customer support, or events.</li>
          </ul>
        </div>
      </Box>

      <Box className="content-block">
        <h3>2. Information We Collect</h3>
        <div className="content-area">
          <p>We collect information about you in the following ways:</p>

          <h4>a. Information You Provide to Us:</h4>
          <ul>
            <li>
              <strong>Personal Information:</strong> When you register on our Services, make purchases, or engage in any
              other interaction with us, we may collect your name, email address, phone number, postal address, and
              payment details, including debit/credit card numbers.
            </li>
            <li>
              <strong>Account Information:</strong> This includes your username, password, and any profile information
              you provide.
            </li>
            <li>
              <strong>Communication Data:</strong> Includes the content of your communications with us, such as
              inquiries, feedback, and responses to surveys.
            </li>
            <li>
              <strong>Transaction Data:</strong> Details about payments and purchases made via our Services.
            </li>
          </ul>

          <h4>b. Information We Collect Automatically:</h4>
          <ul>
            <li>
              <strong>Device and Usage Data:</strong> We automatically collect information about your device, including
              your IP address, browser type, operating system, device model, unique device identifiers, and usage data
              such as the pages you visit, the time spent on those pages, and your interactions with our Services.
            </li>
            <li>
              <strong>Location Data:</strong> If you enable location services on your device, we may collect your
              geographic location data to provide location-based services.
            </li>
            <li>
              <strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar tracking
              technologies to collect information about your interactions with our Services. This helps us understand
              user behavior and improve the user experience.
            </li>
          </ul>

          <h4>c. Information from Third Parties:</h4>
          <ul>
            <li>
              <strong>Social Media:</strong> If you interact with us on social media platforms, we may collect
              information that you make available on those platforms, subject to the platform’s privacy policies.
            </li>
            <li>
              <strong>Partners and Service Providers:</strong> We may receive information about you from our business
              partners, service providers, and other third parties.
            </li>
          </ul>
        </div>
      </Box>

      <Box className="content-block">
        <h3>3. How We Use Your Information</h3>
        <div className="content-area">
          <p>We process your personal information for the following purposes:</p>

          <h4>a. Providing and Improving Services:</h4>
          <ul>
            <li>To operate, maintain, and provide the features and functionality of our Services.</li>
            <li>
              To process your transactions, including order fulfillment, payment processing, and delivery of products.
            </li>
            <li>To manage your account, including user authentication, password management, and customer support.</li>
          </ul>

          <h4>b. Communication:</h4>
          <ul>
            <li>To send you administrative information, such as updates, security alerts, and support messages.</li>
            <li>To respond to your inquiries and provide customer service.</li>
            <li>
              To send you promotional materials, newsletters, and other marketing communications, in accordance with
              your communication preferences.
            </li>
          </ul>

          <h4>c. Personalization and Analytics:</h4>
          <ul>
            <li>To personalize your experience on our Services by presenting content tailored to your interests.</li>
            <li>To conduct analytics and research to improve our Services and develop new products and features.</li>
          </ul>

          <h4>d. Security and Fraud Prevention:</h4>
          <ul>
            <li>
              To protect the security and integrity of our Services, including detecting, preventing, and responding to
              fraud, security breaches, and other potentially harmful activities.
            </li>
          </ul>

          <h4>e. Legal and Regulatory Compliance:</h4>
          <ul>
            <li>
              To comply with legal obligations, including responding to court orders, subpoenas, and other legal
              requests.
            </li>
            <li>To enforce our terms of service, protect our legal rights, and pursue available legal remedies.</li>
          </ul>

          <h4>f. With Your Consent:</h4>
          <ul>
            <li>We may process your information for other purposes that you consent to at the time of collection.</li>
          </ul>
        </div>
      </Box>

      <Box className="content-block">
        <h3>4. Sharing Your Information</h3>
        <div className="content-area">
          <p>We may share your information in the following circumstances:</p>

          <h4>a. Service Providers:</h4>
          <p>
            We share your personal information with third-party service providers who assist us in delivering our
            Services, such as payment processors, shipping companies, and IT service providers. These third parties are
            contractually obligated to protect your information and use it only for the purposes for which it is
            disclosed.
          </p>

          <h4>b. Business Transfers:</h4>
          <p>
            In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be
            transferred to the acquiring entity as part of the transaction.
          </p>

          <h4>c. Legal Obligations and Protection of Rights:</h4>
          <p>
            We may disclose your information if required by law or in response to legal process, such as subpoenas or
            court orders. We may also disclose your information to protect our rights, enforce our terms and conditions,
            and pursue legal remedies.
          </p>

          <h4>d. Affiliates and Subsidiaries:</h4>
          <p>
            We may share your information with our affiliates and subsidiaries for purposes consistent with this Privacy
            Policy.
          </p>

          <h4>e. With Your Consent:</h4>
          <p>We may share your information with third parties when you provide your explicit consent to do so.</p>
        </div>
      </Box>

      <Box className="content-block">
        <h3>5. Payment Information</h3>
        <div className="content-area">
          <p>We collect and process payment information when you make purchases through our Services:</p>

          <h4>a. Payment Data:</h4>
          <p>
            Your payment details, such as credit/debit card numbers and security codes, are processed by our third-party
            payment processor, Razor Pay. We do not store your payment card details on our servers. RazorPay’s privacy
            policy is available{' '}
            <a href="https://razorpay.com/privacy/" target="_blank">
              <span
                style={{
                  color: 'blue',
                  cursor: 'pointer'
                }}
              >
                here
              </span>
            </a>
            .
          </p>

          <h4>b. Security of Payment Information:</h4>
          <p>
            We implement security measures to protect your payment information during transmission. However, please note
            that no electronic transmission or storage method is 100% secure.
          </p>
        </div>
      </Box>

      <Box className="content-block">
        <h3>6. Cookies and Tracking Technologies</h3>
        <div className="content-area">
          <p>We use cookies and similar tracking technologies to enhance your experience on our Services:</p>

          <h4>a. Types of Cookies:</h4>
          <ul>
            <li>
              <strong>Essential Cookies:</strong> Necessary for the operation of our Services.
            </li>
            <li>
              <strong>Performance Cookies:</strong> Collect information about how you use our Services.
            </li>
            <li>
              <strong>Functional Cookies:</strong> Allow us to remember your preferences and settings.
            </li>
            <li>
              <strong>Targeting/Advertising Cookies:</strong> Used to deliver relevant advertisements and track ad
              performance.
            </li>
          </ul>

          <h4>b. Managing Cookies:</h4>
          <p>
            You can manage your cookie preferences through your browser settings. However, disabling certain cookies may
            affect the functionality of our Services.
          </p>
        </div>
      </Box>

      <Box className="content-block">
        <h3>7. Data Security</h3>
        <div className="content-area">
          <p>We are committed to protecting your information:</p>

          <h4>a. Security Measures:</h4>
          <p>
            We use technical and organizational measures, such as encryption and secure servers, to protect your
            personal information from unauthorized access, disclosure, alteration, and destruction.
          </p>
        </div>
      </Box>

      <Box className="content-block">
        <h3>8. Data Retention</h3>
        <div className="content-area">
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this
            Privacy Policy, unless a longer retention period is required or permitted by law:
          </p>

          <h4>a. Retention Periods:</h4>
          <p>
            We retain personal information for the duration of your account and as needed to comply with legal
            obligations, resolve disputes, and enforce agreements.
          </p>

          <h4>b. Deletion of Data:</h4>
          <p>When your information is no longer needed, we will securely delete or anonymize it.</p>
        </div>
      </Box>

      <Box className="content-block">
        <h3>9. Your Privacy Rights</h3>
        <div className="content-area">
          <p>You have the following rights regarding your personal information:</p>

          <h4>a. Access and Correction:</h4>
          <p>
            You have the right to access the personal information we hold about you and to request corrections if it is
            inaccurate or incomplete.
          </p>

          <h4>b. Deletion:</h4>
          <p>
            You may request the deletion of your personal information, subject to certain exceptions, such as if the
            information is needed to comply with legal obligations.
          </p>

          <h4>c. Data Portability:</h4>
          <p>
            You have the right to request a copy of your personal information in a structured, machine-readable format
            and to transfer it to another data controller.
          </p>

          <h4>d. Objection and Restriction:</h4>
          <p>
            You may object to the processing of your personal information or request restrictions on how it is
            processed.
          </p>

          <h4>e. Withdrawal of Consent:</h4>
          <p>
            If you have provided consent for the processing of your personal information, you may withdraw it at any
            time, without affecting the lawfulness of processing based on consent before its withdrawal.
          </p>
        </div>
      </Box>

      <Box className="content-block">
        <h3>10. Changes to This Privacy Policy</h3>
        <div className="content-area">
          <h4>a. Notification of Changes:</h4>
          <p>
            We will notify you of any material changes by posting the updated policy on our website and updating the
            &quot;Last Updated&quot; date.
          </p>

          <h4>b. Your Continued Use:</h4>
          <p>By continuing to use our Services after any changes are made, you agree to the revised Privacy Policy.</p>
        </div>
      </Box>

      <Box className="content-block">
        <h3>11. Contact Us</h3>
        <div className="content-area">
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at{' '}
            <a href="mailto:support@originfresh.in">support@originfresh.in</a>.
          </p>
        </div>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
