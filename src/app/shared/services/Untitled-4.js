// # ({field39,data})=>
{
  if (field39 && field39 === "00" && data) {
    return {
      "account-details": {
        "identification-id": data[0].NATIONALID,
        nationalId: data[0].NATIONALID,
        "is-registered": true,
        "is-imsi": true,
        "is-blocked": data[0].BLOCKED == 1,
        "is-dormant": 0,
        "first-login": data[0].FIRSTLOGIN == 1,
        firstname: data[0]?.FIRSTNAME.toUpperCase(),
        surname:
          data[0].LASTNAME !== undefined ? data[0].LASTNAME.toUpperCase() : "",
        accountType: data[0].ACCOUNTTYPE,
        othername: data[0]?.SECONDNAME?.toUpperCase(),
        fullname: `${data[0]?.FIRSTNAME}${data[0]?.SECONDNAME}${data[0]?.LASTNAME}`,
        active: data[0].BLOCKED === 1,
        gender: data[0].GENDER,
        accType: data[0].ACCOUNTTYPE,
        dob: data[0].DATEOFBIRTH,
        pin: data[0].PIN ? data[0].PIN : "",
        cbsCustId: data[0].CBSCUSTOMERNUMBER ? data[0].CBSCUSTOMERNUMBER : "",
        cbsCustBranchCode: data[0].BRANCHCODE ? data[0].BRANCHCODE : "",
      },
      "global-request-details": {},
      email: data[0].EMAILADDRESS || "",
      msisdn: data[0].PHONENUMBER,
      imsi: "",
      "is-imsi": true,
    };
  }
  if (field39 && field39 === "99") {
    return {
      "account-details": {
        "is-registered": false,
        "is-blocked": false,
        "is-imsi": true,
        "first-login": false,
      },
      "is-imsi": true,
    };
  }
  return {
    "account-details": {
      "is-registered": false,
      "is-blocked": false,
      "is-imsi": true,
      "first-login": false,
    },
    "is-imsi": true,
  };
}
