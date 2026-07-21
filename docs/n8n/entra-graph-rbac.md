# Microsoft Graph für den Mailversand — RBAC-scoped (ohne Tenant-Consent)

Ziel: n8n sendet Mails **ausschließlich** als `kontakt@manibase.de` (Shared Mailbox), nie
tenantweit. Wichtig: Entra-Application-Permissions und Exchange-RBAC sind **additiv** — ein
tenantweiter Admin-Consent für `Mail.Send` würde die RBAC-Beschränkung aushebeln. Deshalb wird
`Application Mail.Send` **nur** über Exchange RBAC vergeben.

## 1. Entra-App-Registrierung

1. Entra-Portal → App-Registrierungen → Neue Registrierung (`manibase-graph-mail`).
2. Client-ID notieren; unter „Zertifikate & Geheimnisse" ein Client-Secret erstellen (Ablauf
   notieren, Rotation planen).
3. **KEIN** Admin-Consent für die Graph-Application-Permission `Mail.Send` erteilen. (API-
   Berechtigungen dort leer/ohne Consent lassen.)

## 2. Exchange Online RBAC for Applications (der eigentliche Scope)

```powershell
Connect-ExchangeOnline
# Service Principal des App-Registrierung-Objekts in Exchange registrieren:
New-ServicePrincipal -AppId <CLIENT_ID> -ObjectId <ENTERPRISE_APP_OBJECT_ID> -DisplayName "manibase-graph-mail"

# Management Scope, der NUR die Shared Mailbox trifft (z. B. via Recipient-Filter):
New-ManagementScope -Name "manibase-kontakt-only" `
  -RecipientRestrictionFilter "PrimarySmtpAddress -eq 'kontakt@manibase.de'"

# Rolle "Application Mail.Send" auf genau diesen Scope zuweisen:
New-ManagementRoleAssignment -App <SP_OBJECT_ID> -Role "Application Mail.Send" `
  -CustomResourceScope "manibase-kontakt-only"
```

## 3. Rest-Grants auditieren

- Vorhandene `Get-ApplicationAccessPolicy` und Entra-Grants der App prüfen und alles entfernen,
  was einen tenantweiten Pfad offen lässt.

## 4. Verifikation (Pflicht, Abnahme `graph-rbac`)

```powershell
# Muss ERLAUBT sein:
Test-ServicePrincipalAuthorization -Identity "manibase-graph-mail" -Resource "kontakt@manibase.de"
# Muss VERWEIGERT sein (Negativtest):
Test-ServicePrincipalAuthorization -Identity "manibase-graph-mail" -Resource "<beliebiges-anderes-postfach>@manibase.de"
```
Zusätzlich nach Cache-Propagation (kann Minuten dauern) einen **echten** Negativversand als
Fremdpostfach versuchen → muss scheitern.

## 5. n8n-Credential

- Typ **OAuth2 API** (Client Credentials Grant):
  - Access Token URL: `https://login.microsoftonline.com/<TENANT_ID>/oauth2/v2.0/token`
  - Client ID / Client Secret: aus Schritt 1
  - Scope: `https://graph.microsoft.com/.default`
- Nur hier liegt das Secret (verschlüsselt). **Niemals** in die Workflow-JSONs. Die HTTP-Nodes
  referenzieren dieses Credential (`genericAuthType: oAuth2Api`).
- Rotation/Ablauf des Secrets dokumentieren; bei Rotation nur das Credential aktualisieren.
