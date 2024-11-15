import { Box, CircularProgress, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import React from 'react';

import {
  activeSupportChatAtom,
  postSupportChatAtom,
  recentOrderAtom,
  supportChatAtom,
} from '../../context/atoms';
import { getSupportChat } from '../../services/getSupprtChat';
import { postMessage } from '../../services/postSupportChat';
import styles from './style.module.css';

const ChatScreen = () => {
  const [supportChat, setSupportChat] = useAtom(supportChatAtom);
  const [postSupportChat, setPostSupportChat] = useAtom(postSupportChatAtom);
  const [chat] = useAtom(supportChatAtom);
  const [recentOrder] = useAtom(recentOrderAtom);
  const orders = recentOrder.data?.map((item: any) => item.order) || [];
  const [activeSupportChat] = useAtom(activeSupportChatAtom);
  React.useEffect(() => {
    const orderId: any = orders.map((order) => order.order_id);

    getSupportChat(setSupportChat, orderId);
  }, []);

  const isLoading = React.useMemo(() => {
    if (postSupportChat.loading) return true;
    if (supportChat.loading) return true;
    return false;
  }, [postSupportChat, supportChat]);

  if (!activeSupportChat) return <></>;

  const message = async (orderId: string | undefined, optionId: string) => {
    if (!orderId) return;
    try {
      const payload = {
        message: optionId,
        ticket_id: chat.data?.id,
        type: 'option',
      };
      await postMessage(payload, orderId, setPostSupportChat);
      await getSupportChat(setSupportChat, orderId);
    } catch (e) {
      // Handle errors
    }
  };

  return (
    <Box>
      <Box className={styles.container}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          chat.data?.chats.map((item: any, index: any) => {
            const chatLength = (chat.data?.chats.length || 1) - 1;

            if (
              !!item.message &&
              item.type === 'message' &&
              item.user_type === 'user'
            )
              return (
                <Box
                  sx={{
                    marginLeft: 'auto',
                    maxWidth: '80%',
                  }}
                >
                  <Typography className={styles['chat-message']}>
                    {item.message}
                  </Typography>
                </Box>
              );

            if (item.question) {
              return (
                <Box key={item.id} className={styles['chat-question']}>
                  <Typography className={styles.question}>
                    {item.question}
                  </Typography>
                  {!!item?.options &&
                    index === chatLength &&
                    item?.options.map((option: any) => (
                      <Box
                        key={option.id}
                        className={styles['chat-option-box']}
                      >
                        {option.message && (
                          <Typography
                            className={styles['chat-option']}
                            onClick={() =>
                              message(String(chat.data?.order_id), option.id)
                            } // Pass the option.id here
                          >
                            {option.message}
                          </Typography>
                        )}
                      </Box>
                    ))}
                </Box>
              );
            }

            return <></>;
          })
        )}
      </Box>
    </Box>
  );
};

export default ChatScreen;
