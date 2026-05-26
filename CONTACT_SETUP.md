# Contact form — email delivery setup

Messages are sent to **abhijithunni3234@gmail.com**.

## Default (no setup)

**FormSubmit** is enabled by default in `contact.config.js`. Submit the form once on your live site; FormSubmit may ask you to confirm your email via a one-time link in your inbox.

## Optional: EmailJS (custom template)

1. Create a free account at [https://www.emailjs.com](https://www.emailjs.com)
2. Add **Gmail** (or Email Service) and connect **abhijithunni3234@gmail.com**
3. Create a template with these variables:

   - `{{operator_name}}`
   - `{{email_channel}}`
   - `{{mission_brief}}`
   - `{{message_payload}}`
   - `{{timestamp}}`
   - `{{system_status}}`
   - `{{reply_to}}`

4. Subject line in template: `🚀 New AI Portfolio Contact Request`
5. Copy `contact.config.example.js` values into `contact.config.js`:

```js
window.CONTACT_CONFIG = {
  recipientEmail: 'abhijithunni3234@gmail.com',
  provider: 'emailjs',
  emailjs: {
    serviceId: 'service_xxxxx',
    templateId: 'template_xxxxx',
    publicKey: 'your_public_key'
  }
};
```

Public keys are safe in the frontend; never put private/secret keys in this repo.
