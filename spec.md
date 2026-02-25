# Specification

## Summary
**Goal:** Update the admin credentials in the Motoko backend so the admin username is `ADMIN` and the password is `Mahendra7959`.

**Planned changes:**
- Update the Motoko backend actor's stored admin username/phone from the old value to `ADMIN`
- Update the Motoko backend actor's stored admin password to `Mahendra7959`
- Ensure the frontend admin login flow continues to authenticate against the backend with the new credentials

**User-visible outcome:** Logging in at the admin login page with username `ADMIN` and password `Mahendra7959` grants admin access, while old credentials no longer work.
