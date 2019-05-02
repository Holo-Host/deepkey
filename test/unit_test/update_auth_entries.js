const sleep = require('sleep');
const REVOCATION_KEY = "HcScIXuxtWI6ttc5gngvQTsDnHtynb5dzyDujh37mNo43nf7ZRB5UZKmR9953pa";
const SIGNED_AUTH_KEY_1 ="LVeIAP0horN0UhEVuqZyDCPjcYzvQUj9AMRm4Hv+xtsS6QoHYUeudekZoVYcPtktf+tDTtP/yFu8O3+jsZDbBQ==";
const WRONG_SINGED_AUTH_KEY = "D16Dl3Cywos/AS/ANPqsvkRZCCKWPd1KTkdANOxqG1MXRtdCaTYYAOO13mcYYtfzWbaagwLk5oFlns2uQneUDg==";
const SIGNED_AUTH_KEY_2 ="LbEReAxFLkkzfOHRBixC7+DYKGao6lPBYsUycVg3NHmNx7p8237/9unBwrt/o+9P4IWkKR+QCYeFxqBNRnn+Dg==";

function genesis (liza){
  return liza.call("deepkey", "init", {revocation_key: REVOCATION_KEY})
}

module.exports = (scenario) => {
  scenario.runTape("testing checks if entries have been pushed", async(t, { liza }) => {
    // On genesis we have to make this call
    let address = genesis(liza)
    let address_recheck = genesis(liza)
    t.deepEqual(address.Ok, address_recheck.Ok )
  })

  scenario.runTape("create rules befor the keyset_root should throw an error", async(t, { liza }) => {
  // This is to just test out if we get the right keyset_root address
    const keyset_root_address = liza.call("deepkey", "get_initialization_data", {})
    console.log("My KeysetRoot Address: ",keyset_root_address);
    t.deepEqual(keyset_root_address.Err.Internal,  'fn handle_get_my_keyset_root(): No KeysetRoot Exists' )
  })


  scenario.runTape("create", async(t, { liza }) => {

    genesis(liza)

    sleep.sleep(5)

    const check_rules = liza.call("deepkey", "get_rules", {})
    console.log("Initial Rules: ",check_rules);
    t.deepEqual(check_rules.Ok.length,1 )

// Check if your getting the right hash
    const my_rules = liza.call("deepkey", "get_rules", {})
    console.log("My Rules: ",my_rules.Ok[0]);
    t.ok(my_rules.Ok[0].entry.revocationKey,REVOCATION_KEY)

// Lets create an authorizor key
    const authorizor_commit =await liza.call("deepkey", "set_authorizor", {
      authorization_key_path: 1,
      signed_auth_key:SIGNED_AUTH_KEY_1
    })
    t.ok(authorizor_commit.Ok)

// Check if the key exist for the authorizor
    const not_registered_key = liza.call("deepkey", "key_status", {key:"Not-Registered-Key"})
    t.deepEqual(not_registered_key.Ok,"Doesn\'t Exists" )

// Check if the key exist for the authorizor
    const checking_authorizor_key = liza.call("deepkey", "key_status", {key:authorizor_commit.Ok})
    t.deepEqual(checking_authorizor_key.Ok,"live" )

// Lets create an authorizor key
    const updated_authorizor_commit = await liza.call("deepkey", "set_authorizor", {
      authorization_key_path: 2,
      signed_auth_key:SIGNED_AUTH_KEY_2
    })
    t.ok(updated_authorizor_commit.Ok)

    const checking_new_authorizor_key = liza.call("deepkey", "key_status", {key:updated_authorizor_commit.Ok})
    t.deepEqual(checking_new_authorizor_key.Ok,"live" )

    sleep.sleep(5);
// Check if the key exist for the authorizor
    const checking_old_authorizor_key = liza.call("deepkey", "key_status", {key:authorizor_commit.Ok})
    t.deepEqual(checking_old_authorizor_key.Ok,"modified" )


    const updated_rule_commit = liza.call("deepkey", "update_rules", {revocation_key:"Updated_Revocation--------------Key"})
    t.ok(updated_rule_commit.Ok )

    sleep.sleep(5);
// Check if your getting the right hash
    const my_updated_rules = liza.call("deepkey", "get_rules", {})
    console.log("My Updated Rules: ",my_updated_rules.Ok[0]);
    t.deepEqual(my_updated_rules.Ok[0].entry.revocationKey,"Updated_Revocation--------------Key" )


  })
}