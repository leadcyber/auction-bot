"use strict";

export default (telegram) => {
  return {
    /**
     * Helper for simple text responses
     * @param chatId
     * @param message
     */
    simpleResponse: (chatId, message) => {
      return telegram.sendMessage({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      });
    },

    /**
     * Extract reciptient data to be used in Telegram send* methods
     * from state
     * @param state
     * @returns {{username: *, chatId: number}}
     */
    recipientFromState: (state) => {
      return {
        username: state.chat.first_name + " " + state.chat.last_name,
        chatId: state.chat.id,
      };
    },
  };
};
