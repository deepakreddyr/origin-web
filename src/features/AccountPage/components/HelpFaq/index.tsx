import { Box, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { useAtom } from 'jotai';
import Image from 'next/image';
import React from 'react';

// import AccountSidebarLayout from '../../../../components/AccountLayout/AccountSidebarLayout'
import CustomExpandIcon from '../../assets/arrow-down.svg';
import Call from '../../assets/call.svg';
import Mail from '../../assets/mail.svg';
import {
  activeAccountsPageAtom,
  // activeSupportChatAtom,
  isAccountIsOpen,
  recentOrderAtom
} from '../../context/atoms';
// import ActiveSidebar from '../../enums/ActiveSidebar'
import { getRecentOrders } from '../../services/recentOrder';
import styles from '../../style.module.css';
import { trackEvent } from '@/utilities/analytics';
import { AnalyticsEvents } from '@/utilities/analyticsEvents';

const HelpFaq = () => {
  // const [isOpen, setIsOpen] = useAtom(isAccountIsOpen)
  const [, setRecentOrderAtom] = useAtom(recentOrderAtom);
  const [recentOrder] = useAtom(recentOrderAtom);
  // const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom)
  const faqs = recentOrder?.data?.map((item: any) => item.faqs) || [];
  // const orders = recentOrder?.data?.map((item: any) => item.order) || []

  React.useEffect(() => {
    getRecentOrders(setRecentOrderAtom);
  }, []);

  // const orderCreatedTime: any = orders.map((order) => order?.order_created_at)
  // const orderCreatedAtTimestamp = orderCreatedTime * 1000 // Convert seconds to milliseconds
  // const orderCreatedAtDate = new Date(orderCreatedAtTimestamp)

  // const options: Intl.DateTimeFormatOptions = {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //     hour: 'numeric',
  //     minute: 'numeric',
  // }

  // const formattedOrderCreatedAt = orderCreatedAtDate.toLocaleDateString(
  //     'en-US',
  //     options
  // )

  return (
    <>
      <Box className={`weekly-wrapper ${styles['weekly-wrapper']}`} sx={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <Box className={`weekly ${styles.weekly}`}>
          <Box component="li" className={`weekly-list-item ${styles['weekly-list-item']}`}>
            <Typography
              sx={{
                fontFamily: 'SofiaPro',
                fontSize: '18px',
                fontWeight: 600,
                color: '#231F20CC'
              }}
            >
              Contact US
            </Typography>
            <Box
              sx={{
                display: 'flex'
              }}
            >
              <Image src={Call} alt="call" />
              <Typography
                sx={{
                  fontFamily: 'SofiaPro',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#25874D',
                  marginLeft: '0.2rem'
                }}
              >
                <a
                  href={`tel:${recentOrder?.data?.[0]?.support_phone}`}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  onClick={() => trackEvent(AnalyticsEvents.CUSTOMER_SUPPORT_PHONE)}
                >
                  {recentOrder?.data?.[0]?.support_phone}
                </a>
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex'
              }}
            >
              <Image src={Mail} alt="call" />
              <Typography
                sx={{
                  fontFamily: 'SofiaPro',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#25874D',
                  marginLeft: '0.2rem'
                }}
              >
                <a
                  href={`mailto:${recentOrder?.data?.[0]?.support_email}`}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  onClick={() => trackEvent(AnalyticsEvents.CUSTOMER_SUPPORT_EMAIL)}
                >
                  {recentOrder?.data?.[0]?.support_email}
                </a>
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          className="faq"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontFamily: 'SofiaPro',
              fontSize: '18px',
              fontWeight: 600,
              color: '#000000'
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Box
            component="ul"
            className="accordion-list"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              listStyleType: 'none',
              padding: 0,
              margin: 0,
              '.accordion-list-item': {
                margin: '0.2rem 0 0.2rem 0',
                padding: '0.3rem 0.7rem',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                border: '2px solid rgba(35, 31, 32, 0.04)',
                borderRadius: '16px',
                '&:before': {
                  display: 'none'
                },
                '&.Mui-expanded': {
                  marginBottom: '6px',
                  '.accordion-summary': {
                    h4: {
                      color: '#00855B'
                    }
                  }
                },
                '.accordion-details': {
                  paddingLeft: 0,
                  paddingRight: 0,
                  fontSize: '14px',
                  paddingTop: 0
                },
                '.accordion-summary': {
                  minHeight: 48,
                  padding: 0,
                  fontSize: '14px',
                  '.MuiAccordionSummary-content': {
                    margin: 0
                  },
                  '.MuiAccordionSummary-expandIconWrapper': {
                    svg: {
                      path: {
                        fill: '#00855B'
                      }
                    }
                  }
                }
              }
            }}
          >
            {faqs.map((faq: any) =>
              faq.map((item: any) => (
                <Accordion component="li" key={item.id} className="accordion-list-item accordion-custom">
                  <AccordionSummary
                    className="accordion-summary"
                    expandIcon={<Image src={CustomExpandIcon} alt="Expand Icon" />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography sx={{ fontFamily: 'SofiaPro' }} variant="body2">
                      {item.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className="accordion-details">
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        fontFamily: 'SofiaPro'
                      }}
                    >
                      {item.description}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default HelpFaq;
