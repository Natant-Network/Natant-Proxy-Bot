export const ClientMessages = {
  // Also used in lib/proxy.ts
  ERR_SERVER_NOT_FOUND: "Server not found! Please tell the server owner or a admin to run /get-started!",
  ERR_SERVER_NOT_FOUND_ADMIN: "Server not found! Please run /get-started to set up Link Master!",
  ERR_NEED_PREMIUM: "You can purchase premium with `/premium view`",
  ERR_FAILED_DM: "Failed to DM you the requested link!",
  MSG_CHECK_DMS: "Check your DMs for the requested link!",
  ERR_USER_NOT_USED_BOT: "That user has not used the proxy bot!",
  ERR_YOU_HAVE_NOT_USED_BOT: "You have not used the proxy bot!",
  ERR_NO_LINKS_ADMIN: "No links found! Add one with /link add"
}

export const ProxyMessages = {
  ERR_CATEGORY_NOT_FOUND: "Invalid category `%s`",
  ERR_REACHED_LINK_LIMIT: "You have reached the limit of %s links set by the server",
  ERR_GOT_ALL_LINKS: "You have already received all available links for category `%s`",
  ERR_NO_LINKS: "There are no available links for category `%s`"
}