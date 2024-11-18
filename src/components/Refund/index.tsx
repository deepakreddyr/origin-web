import React from "react";
import { Box, Container } from "@mui/material";

const Refund = () => (
  <Container
    sx={{
      paddingTop: 12,
      paddingBottom: 12,
      fontSize: 16,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      fontFamily: "SofiaPro",
      "& + .footer": {
        display: "none",
      },
      h3: {
        fontSize: 20,
        fontWeight: "600",
        paddingTop: 3,
        paddingBottom: 1,
      },
      h2: {
        fontSize: 22,
        fontWeight: "600",
        paddingTop: 2,
        paddingBottom: 1,
      },
      h4: {
        fontSize: 18,
        fontWeight: "600",
      },
      ul: {
        listStyleType: "disc",
        paddingLeft: 5,
      },
      ol: {
        listStyleType: "decimal",
        paddingLeft: 5,
      },
      p: {
        marginTop: "2rem",
      },

      a: {
        "&:hover": {
          textDecoration: "underline",
        },
      },
      "@media screen and (max-width: 767px)": {
        paddingTop: 3,
        paddingBottom: 4,
        gap: 2,
        h3: {
          fontSize: 18,
          fontWeight: "600",
        },
        ".content-area, .content-block": {
          gap: 2,
        },
        ".content-block": {
          ".content-area": {
            ul: {
              listStyleType: "disc",
              paddingLeft: 3,
            },
            ol: {
              listStyleType: "decimal",
              paddingLeft: 3,
            },

            h4: {
              fontSize: 16,
              fontWeight: "600",
            },
            h2: {
              fontSize: 18,
              fontWeight: "600",
            },
            "*": {
              fontSize: 14,
            },
          },
        },
      },
    }}
  >
    <h2>RETURN AND REFUND POLICY</h2>
    <div>
      <p>
        Our Return and Refund Policy forms are part of and must be read in
        conjunction with the website’s Terms and Conditions. We reserve the
        right to change this Return and Refund Policy at any time.
      </p>
      {/* <p>
             These terms and conditions supersede all previous representations,
             understandings, or agreements and shall prevail notwithstanding any
             variance with any other terms of any order submitted. By using
             originfresh You agree to be bound by the Terms and Conditions. Not
             having read these terms and conditions is no reason to be no bound
             by these terms and conditions.
           </p> */}
    </div>
    <div>
      <h3>RETURN POLICY</h3>
      <p>
        If the customer is not satisfied with the quality of our product and
        wants to return it, they can do it within 6 hours after delivery. After
        6 hours of delivery of the product, we shall be not liable to accept a
        return from the Customers.
      </p>
      <h6>Eligibility for Return:</h6>
      <p>
        <ul>
          <li>
            All customers must contact support@originfresh.in / +91 72000 98235
            for approval before sending or returning any item to us.
          </li>
          <li>
            https://originfresh.in will not be responsible for the returned item
            without prior notification to https://originfresh.in.
          </li>
        </ul>
        Note: https://originfresh.in reserves the right to make any changes to
        the return policy. The changes will be updated on our website.
      </p>
      <h3>DAMAGED OR INCORRECT PRODUCT</h3>
      <p>
        When the product is incorrect from the one that the customer ordered or
        when the item is damaged, the customer has to send photos or a video
        within 12 hours after delivery that shows the item is incorrect or
        damaged.
      </p>
      <p>
        In this case, we will reship a new item or issue a refund after
        inspecting the item. And, the customer shall be liable to return the
        product as per our return policy (mentioned above). The Replacement will
        be made at our sole discretion.
      </p>
      <p>
        In case of a damaged product, the shipping cost shall be paid by the
        Company.
      </p>
      <p>
        All refunds will be an issue as per our refund policy. Please contact us
        via email. We will respond within 2 (Two) business days.
      </p>
      <p>
        Moreover, if we remove or suspend you for your breach of the website
        terms, then you will not receive a refund for our service
      </p>
      <p>
        In a determination to accomplish user satisfaction, if there is an
        issue, you can contact us through our email at support@originfresh.in.
      </p>
      <h3>REFUND CYCLE:</h3>
      <p>
        The complete refund process usually takes about 7 to 10 working days
        from the date of confirmation of the refund.
      </p>
      <h3>CANCELLATION POLICY:</h3>
      <p>
        You may request to cancel your order for a full refund, up to 6 hours
        before the order has been shipped. Cancellation requests made after 6
        hours from the order created time may not receive a refund nor a
        transfer.
      </p>
    </div>
  </Container>
);

export default Refund;
