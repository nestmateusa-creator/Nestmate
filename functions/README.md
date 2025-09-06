Cloud Function: toggleGpt5

This Cloud Function provides a secure admin-only way to toggle the `gpt5_mini_enabled` flag in Firestore.

Deployment:
- Install firebase-tools and initialize functions directory
- Deploy with `firebase deploy --only functions:toggleGpt5`

Security:
- The function checks `context.auth.token.admin` or an allowlist UID. Set a custom claim `admin:true` on admin users or update the allowlist.

Client example (web):

const toggle = firebase.functions().httpsCallable('toggleGpt5');
await toggle({ enabled: true });

ADMIN_UID fallback & CI
-----------------------
The `toggleGpt5` function prefers a Firebase custom claim `admin:true` for authorization. For convenience in local development or CI you can also provide an allowlist UID via environment or `.firebaserc`:

- Set `ADMIN_UID` environment variable (comma-separated UIDs allowed) when deploying or running functions locally.
- Alternatively, add `"adminUid": "THE_UID"` to your `.firebaserc` for local convenience (the function reads this file if present).

CI example (GitHub Actions): set the env when deploying functions or running integration tests:

```yaml
env:
	ADMIN_UID: ${{ secrets.ADMIN_UID }}
```

Security note: For production use prefer custom claims on users rather than allowlisting UIDs. Use `admin` custom claims set via the admin SDK (see `scripts/set-admin-claim.js`) and restrict who can call the function.
