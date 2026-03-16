# Power Automate Setup Guide for the Support Ticket System

To fully integrate your Support Ticket System with Microsoft Teams using **threaded replies**, you need to set up two separate flows.

### Flow 1: Teams Message -> Create Ticket (Incoming)

This flow listens for new messages in a Teams channel and sends the thread context to your backend.

1.  **Go to Power Automate** (make.powerautomate.com) and click **Create** -> **Automated cloud flow**.
2.  **Name your flow** "Threaded Create Ticket".
3.  **Choose the trigger:** Search for Teams and select **"When a new channel message is added"**. Click **Create**.
4.  **Configure the Trigger:** Select your Team and the desired Channel.
5.  **Add an Action:** Search for **"HTTP"** (Premium).
    *   **Method:** `POST`
    *   **URI:** `https://test-ticket-production.up.railway.app/api/tickets`
    *   **Headers:** Set `Content-Type` to `application/json`.
    *   **Body:** Paste this JSON and map the dynamic fields inside the quotes:
        ```json
        {
          "message": "@{triggerBody()?['body']['content']}",
          "senderEmail": "@{triggerBody()?['from']['user']['email']}",
          "messageId": "@{triggerBody()?['id']}",
          "channelId": "@{triggerBody()?['channelIdentity']['channelId']}",
          "teamId": "@{triggerBody()?['channelIdentity']['teamId']}"
        }
        ```
6.  Click **Save**. Now your backend stores everything it needs to reply back to this exact thread!

---

### Flow 2: Backend Reply -> Teams Message (Outgoing Threaded)

This flow receives replies from your dashboard and posts them inside the original Teams thread.

1.  **Go to Power Automate** and click **Create** -> **Instant cloud flow**.
2.  **Name your flow** "Threaded Ticket Reply" and select the **"When an HTTP request is received"** trigger.
3.  **Configure the Trigger Schema:** Click "Use sample payload to generate schema" and paste this JSON:
    ```json
    {
      "teamId": "19:xyz",
      "channelId": "19:abc",
      "messageId": "1678392",
      "reply": "Technician will check the printer tomorrow"
    }
    ```
4.  **Add an Action:** Search for **Microsoft Teams** and select **"Reply with message in a channel"**.
    *   **Post as:** Flow bot
    *   **Post in:** Channel
    *   **Team:** Select `teamId` from dynamic content.
    *   **Channel:** Select `channelId` from dynamic content.
    *   **Message ID:** Select `messageId` from dynamic content.
    *   **Message:** Select `reply` from dynamic content.
5.  Click **Save**.

### The Final Step: Update Railway Webhook!

When you save **Flow 2**, copy the generated **HTTP POST URL**. Go to your **Railway Dashboard**, open the **Variables** tab for your backend, and update the `POWER_AUTOMATE_WEBHOOK` with this new URL.

🎉 **You are ready!** Your Support tickets will now stay localized in their original Teams threads!
