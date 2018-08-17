# API test endpoints

https://sandboxapi.hackney.gov.uk/manageatenancy/swagger/
For fetching search results for tenants.

https://sandboxapi.hackney.gov.uk/v1/Contacts/GetCautionaryAlerts?urpn=100021057689
Receive information about a cautionary alert for a tenant, if the tenant's details includes { cautionaryAlert: true }.

```
{
    "cautionaryAlertType": "[Temporary] Seek advice",
    "cautionaryAlertId": "fb4df427-c131-e811-811d-70106faa7791",
    "contactId": "8253f3e5-948f-e611-8974-00505698417b",
    "contactName": "Nicholas James Garcia",
    "uprn": "100021024079",
    "createdOn": "2018-03-27 13:17:29"
}
```

http://lbhwebapit01:2020/swagger/index.html
Endpoints for GOV.UK Notify templates.

https://hlbctrial-dev.outsystemsenterprise.com/manageatenancy/CreateContact.aspx?(Not.Licensed.For.Production)=
Add contact details to the CRM, which should appear in the results from the API.
