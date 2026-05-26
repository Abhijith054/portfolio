/**
 * Contact transmission config
 * — FormSubmit works out of the box (no keys).
 * — For EmailJS: fill serviceId, templateId, publicKey and set provider to 'emailjs'.
 *   See CONTACT_SETUP.md
 */
window.CONTACT_CONFIG = {
  recipientEmail: 'abhijithunni3234@gmail.com',
  provider: 'formsubmit',
  emailjs: {
    serviceId: '',
    templateId: '',
    publicKey: ''
  }
};
