/**
 * config.js — shared by attendance.html and admin.html.
 * EDIT ME after you deploy the Apps Script web app and set up EmailJS.
 */
const CONFIG = {
  // Apps Script: Deploy -> New deployment -> Web app -> copy the /exec URL here
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbw9J7nc6UIR0A39Ttz-3z0AsagCGWNl2vyYueXOoOKp9I0d_6cgVcOhT15UYbbBKlQGXw/exec',

  // EmailJS: from your EmailJS dashboard (Account -> General for the public key,
  // Email Services for the service ID, Email Templates for the template ID)
  EMAILJS_PUBLIC_KEY: 'a-iVY0pJ6pOe5oSVJ',
  EMAILJS_SERVICE_ID: 'service_jy4519q',
  EMAILJS_TEMPLATE_ID: 'template_1r4v5yn',
  EMAILJS_WELCOME_TEMPLATE_ID: 'template_welcome_Localho',   // sent when admin adds a new student
  EMAILJS_REMINDER_TEMPLATE_ID: 'template_welcome_Localho', // sent by the admin's "Remind" button

  BUSINESS_NAME: 'Localhost Kitchen',
};
