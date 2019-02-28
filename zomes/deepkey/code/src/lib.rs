#![feature(try_from)]
#[macro_use]
extern crate hdk;
extern crate serde;
#[macro_use]
extern crate serde_derive;
extern crate serde_json;
#[macro_use]
extern crate holochain_core_types_derive;

use hdk::{
    error::ZomeApiResult,
};
use hdk::holochain_core_types::{
    cas::content::Address,
    entry::Entry,
    dna::entry_types::Sharing,
    error::HolochainError,
    json::JsonString,
};

pub mod authorizor;
// pub mod device_authorization;
pub mod key_anchor;
pub mod key_registration;
pub mod keyset_root;
pub mod rules;

define_zome! {
    entries: [
        authorizor::definitions(),
        // device_authorization::definitions(),
        key_anchor::definitions(),
        key_registration::definitions(),
        keyset_root::definitions(),
        rules::definitions()
    ]

    genesis: || {
        Ok(())
    }

    functions: [
        set_keyset_root: {
            inputs: | |,
            outputs: |result: ZomeApiResult<Address>|,
            handler: keyset_root::keyset_root::handle_set_keyset_root
        }
        get_keyset_root: {
            inputs: | address: Address |,
            outputs: |result: ZomeApiResult<Option<Entry>>|,
            handler: keyset_root::keyset_root::handle_get_keyset_root
        }
    ]

    traits: {
        hc_public [
        set_keyset_root,
        get_keyset_root
        ]
    }
}
