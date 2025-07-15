# Newsletter Integration with Brevo

## Overview

The newsletter integration allows users to subscribe to AI travel planning tips and updates through the footer newsletter signup form. The integration uses Brevo (formerly Sendinblue) as the email service provider.

## Implementation Details

### Backend API

**File:** `src/app/api/newsletter/route.ts`

The API endpoint handles newsletter subscriptions with the following features:

- **Email Validation**: Validates email format before processing
- **Brevo Integration**: Uses Brevo API to add contacts to list #15
- **Error Handling**: Handles duplicate emails, invalid emails, and API errors
- **Response Format**: Returns success/error messages in JSON format

### Frontend Integration

**File:** `src/components/landing/Footer.tsx`

The footer component includes:

- **Form Handling**: Controlled form with email state management
- **Loading States**: Shows loading spinner during submission
- **Toast Notifications**: Uses the existing toast system for feedback
- **Error Handling**: Displays user-friendly error messages

### Environment Variables

Required environment variable:
```env
BREVO_API_KEY=your_brevo_api_key_here
```

### Brevo Configuration

- **List ID**: #15 (as specified in requirements)
- **Update Enabled**: Yes (allows updating existing contacts)
- **Error Handling**: Proper handling of duplicate and invalid emails

## User Flow

1. **User enters email** in the newsletter signup form
2. **Form validation** checks email format
3. **API call** to `/api/newsletter` with email
4. **Brevo API** adds contact to list #15
5. **Success/Error response** shown via toast notification
6. **Form reset** on successful subscription

## Error Handling

### Common Error Scenarios

1. **Missing Email**: "Email is required"
2. **Invalid Email Format**: "Please enter a valid email address"
3. **Duplicate Email**: "This email is already subscribed to our newsletter"
4. **API Errors**: "Failed to subscribe to newsletter. Please try again."

### Error Response Format

```json
{
  "error": "Error message here"
}
```

## Testing

### Manual Testing

1. **Valid Email**: Enter a valid email address and submit
2. **Invalid Email**: Try submitting with invalid email format
3. **Duplicate Email**: Try subscribing the same email twice
4. **Empty Form**: Try submitting without entering an email

### Automated Testing

Run the test script to verify integration:
```bash
npm run test:newsletter
```

The test script verifies:
- API key configuration
- Contact creation
- Duplicate email handling
- Invalid email handling

## Security Considerations

- **API Key**: Stored securely in environment variables
- **Email Validation**: Server-side validation prevents invalid submissions
- **Rate Limiting**: Consider implementing rate limiting for production
- **Data Privacy**: Emails are stored in Brevo's secure infrastructure

## Future Enhancements

### Potential Improvements

1. **Double Opt-in**: Require email confirmation before subscription
2. **Custom Fields**: Add name, preferences, or other contact fields
3. **Segmentation**: Different lists for different user types
4. **Analytics**: Track subscription rates and engagement
5. **Unsubscribe**: Add unsubscribe functionality

### Additional Features

1. **Welcome Email**: Send welcome email to new subscribers
2. **Content Personalization**: Tailor content based on user preferences
3. **A/B Testing**: Test different signup form variations
4. **Integration with User Accounts**: Link newsletter preferences to user accounts

## Troubleshooting

### Common Issues

1. **API Key Issues**
   - Verify `BREVO_API_KEY` is set correctly
   - Check if the API key has proper permissions
   - Ensure the key is not expired

2. **List ID Issues**
   - Verify list #15 exists in your Brevo account
   - Check if the list is active and accessible
   - Ensure proper permissions for the list

3. **Network Issues**
   - Check internet connectivity
   - Verify Brevo API endpoints are accessible
   - Check for firewall or proxy issues

### Debug Steps

1. **Check Environment Variables**
   ```bash
   npm run check:env
   ```

2. **Test API Integration**
   ```bash
   npm run test:newsletter
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

### POST /api/newsletter

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to our newsletter!"
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
- `400`: Bad Request (invalid email, duplicate, etc.)
- `500`: Internal Server Error

## Dependencies

- `@getbrevo/brevo`: Official Brevo SDK for Node.js
- `next`: Next.js framework for API routes
- `react`: React for frontend components
- `framer-motion`: Animation library for UI effects 