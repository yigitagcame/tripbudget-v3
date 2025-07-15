# Contact Form Integration with Brevo

## Overview

The contact form integration allows users to send messages directly to the support team through a web form. The integration uses Brevo (formerly Sendinblue) as the email service provider to send transactional emails.

## Implementation Details

### Backend API

**File:** `src/app/api/contact/route.ts`

The API endpoint handles contact form submissions with the following features:

- **Form Validation**: Validates all required fields and email format
- **Brevo Integration**: Uses Brevo API to send transactional emails
- **Error Handling**: Handles validation errors, API errors, and configuration issues
- **Response Format**: Returns success/error messages in JSON format

### Frontend Integration

**File:** `src/app/contact/page.tsx`

The contact page includes:

- **Form State Management**: Controlled form with React state
- **Loading States**: Shows loading spinner during submission
- **Toast Notifications**: Uses the existing toast system for feedback
- **Form Validation**: Client-side validation before submission
- **Form Reset**: Clears form on successful submission

### Environment Variables

Required environment variables:
```env
BREVO_API_KEY=your_brevo_api_key_here
SUPPORT_EMAIL_ADDRESS=your_support_email_here
```

### Brevo Configuration

- **Transactional Email**: Uses Brevo's transactional email API
- **Reply-To**: Sets reply-to address to the user's email
- **Email Format**: Sends both HTML and text versions
- **Error Handling**: Proper handling of API errors and rate limits

## User Flow

1. **User fills form** with name, email, subject, and message
2. **Form validation** checks all fields and email format
3. **API call** to `/api/contact` with form data
4. **Brevo API** sends email to support address
5. **Success/Error response** shown via toast notification
6. **Form reset** on successful submission

## Email Format

The contact form sends emails with the following format:

```
**Name:** [First Name] [Last Name]
**Email:** [user@example.com]
**Subject:** [Subject]

**Message:**
[User's message content]
```

### Email Features

- **Subject Line**: "Contact Form: [User's Subject]"
- **Recipient**: Support email address from environment variable
- **Reply-To**: User's email address for easy response
- **Content**: Formatted with bold labels and user message
- **HTML Support**: Both HTML and text versions sent

## Error Handling

### Common Error Scenarios

1. **Missing Fields**: "All fields are required"
2. **Invalid Email Format**: "Please enter a valid email address"
3. **Missing Configuration**: "Contact form is not configured. Please try again later."
4. **API Errors**: "Failed to send message. Please try again."

### Error Response Format

```json
{
  "error": "Error message here"
}
```

## Testing

### Manual Testing

1. **Valid Form**: Fill all fields with valid data and submit
2. **Invalid Email**: Try submitting with invalid email format
3. **Missing Fields**: Try submitting with empty required fields
4. **Empty Form**: Try submitting without entering any data

### Automated Testing

Run the test script to verify integration:
```bash
npm run test:contact
```

The test script verifies:
- Environment variable configuration
- Brevo API connection
- Email sending functionality
- API endpoint functionality

## Security Considerations

- **API Key**: Stored securely in environment variables
- **Email Validation**: Server-side validation prevents invalid submissions
- **Rate Limiting**: Consider implementing rate limiting for production
- **Data Privacy**: User data is only used for sending the contact email

## Future Enhancements

### Potential Improvements

1. **Rate Limiting**: Add rate limiting to prevent spam
2. **CAPTCHA**: Add CAPTCHA for additional spam protection
3. **File Attachments**: Allow users to attach files
4. **Auto-Response**: Send automatic confirmation email to user
5. **Ticket System**: Integrate with a ticket management system

### Additional Features

1. **Email Templates**: Use Brevo templates for consistent formatting
2. **Contact Categories**: Add dropdown for different inquiry types
3. **Priority Levels**: Allow users to set message priority
4. **Follow-up Tracking**: Track if support has responded
5. **Analytics**: Track contact form usage and success rates

## Troubleshooting

### Common Issues

1. **API Key Issues**
   - Verify `BREVO_API_KEY` is set correctly
   - Check if the API key has transactional email permissions
   - Ensure the key is not expired

2. **Support Email Issues**
   - Verify `SUPPORT_EMAIL_ADDRESS` is set correctly
   - Check if the email address is valid
   - Ensure the email domain is properly configured

3. **Email Sending Issues**
   - Check Brevo account email sending limits
   - Verify sender domain is authenticated in Brevo
   - Check for any Brevo account restrictions

4. **Network Issues**
   - Check internet connectivity
   - Verify Brevo API endpoints are accessible
   - Check for firewall or proxy issues

### Debug Steps

1. **Check Environment Variables**
   ```bash
   npm run check:env
   ```

2. **Test Contact Integration**
   ```bash
   npm run test:contact
   ```

3. **Check Browser Console**
   - Look for network errors
   - Check for JavaScript errors
   - Verify API responses

4. **Check Server Logs**
   - Monitor API endpoint logs
   - Check for Brevo API errors
   - Verify request/response data

## API Reference

### POST /api/contact

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "subject": "General Inquiry",
  "message": "Hello, I have a question about your service."
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Thank you for your message! We will get back to you soon."
}
```

**Error Response:**
```json
{
  "error": "Error message here"
}
```

**Status Codes:**
- `200`: Success
- `400`: Bad Request (validation errors)
- `500`: Internal Server Error

## Dependencies

- `@getbrevo/brevo`: Official Brevo SDK for Node.js
- `next`: Next.js framework for API routes
- `react`: React for frontend components
- `framer-motion`: Animation library for UI effects

## Conclusion

The contact form integration provides a seamless way for users to reach out to the support team. The implementation follows best practices for:

- **Security**: Proper API key management and validation
- **User Experience**: Smooth form interaction with clear feedback
- **Error Handling**: Comprehensive error scenarios covered
- **Testing**: Automated testing for all functionality
- **Documentation**: Complete setup and usage documentation

The integration successfully sends contact form submissions to the support team via Brevo's transactional email service. 