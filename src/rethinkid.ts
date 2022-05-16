import RethinkID from "@mostlytyped/rethinkid-js-sdk";

const baseURL = window.location.origin;

const config = {
  appId: "45e1235b-fce9-4b43-9dc7-3fd5f3dac880",
  logInRedirectUri: `${baseURL}/callback`,
  dataAPIConnectErrorCallback: function() {
    // this = RethinkID
    // @ts-ignore
    this.logOut();
  },
};

export const rid = new RethinkID(config);
