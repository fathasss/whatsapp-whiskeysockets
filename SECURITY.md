# 🔐 Security Policy

**Project:** WhatsApp Whiskeysockets  
**Repository:** [https://github.com/fathasss/whatsapp-whiskeysockets](https://github.com/fathasss/whatsapp-whiskeysockets)  
**Maintainer:** Fatih HAS (Project Owner)

---

## 1. Supported Versions

The following table lists the supported versions of this project for which security updates will be provided.

| Version | Supported          | End of Support |
|----------|-------------------|----------------|
| main     | ✅ Yes             | Ongoing        |
| < 1.0.0  | ❌ No              | -              |

---

## 2. Reporting a Vulnerability

If you identify a security vulnerability, please report it **privately** and **responsibly**.

### 🔒 Preferred Reporting Methods:
- 📧 Email: [fatihhas2609@gmail.com](mailto:fatihhas2609@gmail.com)
- 🔐 GitHub Security Advisories: [Submit via GitHub](https://github.com/fathasss/whatsapp-whiskeysockets/security/advisories/new)

> Do **not** create a public GitHub issue to report vulnerabilities.

---

## 3. Vulnerability Disclosure Policy

This project follows a **Responsible Disclosure Policy** inspired by [ISO/IEC 29147:2018](https://www.iso.org/standard/72311.html) and the [CERT/CC Guidelines for Reporting Vulnerabilities](https://vuls.cert.org/confluence/display/Wiki/Coordinated+Vulnerability+Disclosure).

### ✅ Researcher Commitments
- Avoid exploiting vulnerabilities beyond what is necessary to demonstrate the issue.
- Do not access, modify, or delete user data.
- Do not publicly disclose the vulnerability before a patch is released.

### 🧭 Maintainer Commitments
- Acknowledge receipt of your report within **48 hours**.
- Provide an initial assessment within **7 business days**.
- Issue a security fix or mitigation plan within **30 days**, where feasible.

---

## 4. Security Severity Classification

| Severity Level | Description |
|-----------------|-------------|
| **Critical** | Remote code execution, privilege escalation, or credential leakage. |
| **High** | Authentication bypass, data exposure, or major denial-of-service. |
| **Medium** | Session hijacking, input validation, or configuration weaknesses. |
| **Low** | Information disclosure or minor configuration issues. |

Each report will be assessed using the **CVSS v3.1** (Common Vulnerability Scoring System).

---

## 5. Patch and Release Management

- Security patches are issued through tagged releases (e.g. `v1.0.2-security`).
- Fixes are published with changelog details under **GitHub Releases**.
- Security advisories will be published through the [GitHub Advisory Database](https://github.com/advisories).

---

## 6. Data Protection and Secrets Management

If you deploy this project, adhere to the following security recommendations:

- Use **environment variables** for sensitive credentials.
- Protect the `.env` file with restricted file permissions.
- Rotate the following credentials regularly:
  - `JWT_SECRET`
  - `MONGO_URI`
  - `WHATSAPP_SESSION_KEYS`
- Use HTTPS and secure reverse proxies (e.g. Nginx, Cloudflare, Traefik).
- Regularly update dependencies to mitigate known CVEs.

---

## 7. Security Auditing and Monitoring

- Periodic dependency scanning via [GitHub Dependabot](https://docs.github.com/en/code-security/dependabot).
- Use `npm audit` or third-party scanners (e.g. Snyk) for local vulnerability checks.
- All user authentication and token handling is subject to internal security review.

---

## 8. Legal and Compliance

By submitting a vulnerability report:
- You agree to **not disclose** the vulnerability before an official fix is released.
- You acknowledge that your testing will **not harm production systems** or user data.
- You may request public acknowledgment in the release notes (optional).

---

## 9. Contact

For all security-related matters:

**Maintainer:** Fatih HAS  
**Email:** [fatihhas2609@gmail.com](mailto:fatihhas2609@gmail.com)  
**GitHub:** [@fathasss](https://github.com/fathasss)

---

## 10. Attribution

This Security Policy is aligned with:
- [ISO/IEC 29147:2018 — Vulnerability Disclosure](https://www.iso.org/standard/72311.html)  
- [ISO/IEC 30111:2019 — Vulnerability Handling Processes](https://www.iso.org/standard/69725.html)  
- [CVSS v3.1 Specification](https://www.first.org/cvss/)  
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

---

© 2025 Fatih HAS — All rights reserved.
