# MedTrack AI — Security & Privacy

## 1. Security Objective

MedTrack AI handles health-related information. The MVP therefore needs reasonable application security even though it is not intended to be production-scale healthcare infrastructure.

This is a hackathon MVP architecture, not a claim of healthcare regulatory compliance.

## 2. Secrets

Use environment variables:

```env
MONGODB_URI=
JWT_SECRET=
GEMINI_API_KEY=
FRONTEND_URL=
NODE_ENV=development
PORT=5000
```

Never commit `.env`.

Never send MongoDB credentials, JWT secrets, or Gemini API keys to React.

## 3. MongoDB Atlas

Use:
- strong database credentials,
- TLS,
- private database access,
- appropriate network access configuration,
- least privilege where practical.

Do not expose MongoDB directly to the browser.

## 4. Patient Isolation

Every patient-owned query must include an ownership condition.

Safe pattern:

```js
Medication.findOne({
  _id: id,
  patientId: req.user.id
})
```

Caregiver requests must verify an accepted relationship.

## 5. Caregiver Authorization

Authorization is explicit:

```text
patientId
caregiverId
status = accepted
```

Pending/revoked relationships do not grant access.

## 6. Prescription Privacy

Do not:
- create public permanent prescription URLs,
- expose GridFS credentials,
- put prescription contents in URLs,
- return another patient's prescription based only on an ID.

If GridFS is used, serve files through authenticated Express routes.

## 7. Input Validation

Validate:
- request bodies,
- query parameters,
- ObjectIds,
- email,
- passwords,
- medication fields,
- schedule times,
- dates,
- caregiver codes,
- upload MIME types and size.

## 8. JWT

- Strong random secret
- Expiration
- Minimal claims
- HTTPS in production
- Signature + expiry validation
- Never trust a user ID supplied by the request body when authenticated identity is available from JWT

## 9. CORS

Production CORS should allow only the deployed frontend origin.

Avoid unrestricted `*` for credentialed production requests.

## 10. HTTP Security

Use:
- HTTPS
- Helmet
- JSON body size limits
- secure cookie settings if cookies are used
- sanitized production errors

## 11. Rate Limiting

Use lightweight rate limiting for:
- login,
- registration,
- password-related endpoints if added,
- AI extraction,
- prescription upload.

## 12. File Upload Security

For prescription images:
- accept only needed image types,
- enforce a size limit,
- do not trust filenames,
- generate server-side identifiers,
- do not execute uploaded files,
- store privately.

## 13. AI Security

Gemini output is untrusted input.

The backend must:
- keep the API key private,
- validate model output,
- never directly activate extracted medication,
- require user verification.

AI must not diagnose, change doses, recommend stopping medication, or override clinician instructions.

## 14. Logging

Allowed:
- request path,
- method,
- status,
- duration,
- non-sensitive error identifiers.

Do not log:
- passwords,
- JWT secrets,
- MongoDB URI,
- Gemini API key,
- full prescription images,
- unnecessary sensitive prescription contents.

## 15. Limitations

This MVP is not a complete healthcare compliance implementation. Real clinical deployment would require professional review of privacy, legal/regulatory obligations, audit controls, infrastructure hardening, retention, and incident response.

## 16. Deployment Checklist

- [ ] HTTPS enabled
- [ ] Strong JWT secret
- [ ] MongoDB credentials private
- [ ] Gemini API key private
- [ ] CORS restricted
- [ ] Password hashing enabled
- [ ] JWT expiration enabled
- [ ] Auth middleware tested
- [ ] Patient ownership tested
- [ ] Caregiver authorization tested
- [ ] Prescription access tested
- [ ] Validation enabled
- [ ] Rate limiting enabled
- [ ] Secure headers enabled
- [ ] Production errors sanitized
- [ ] `.env` excluded from Git
