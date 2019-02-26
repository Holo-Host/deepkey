use hdk::{
    self,
    entry_definition::ValidatingEntryType,
};
use hdk::holochain_core_types::{
    dna::entry_types::Sharing,
    error::HolochainError,
    json::JsonString,
    hash::HashString,
    signature::Signature
};

pub mod rules;

#[derive(Serialize, Deserialize, Debug, Clone, DefaultJson)]
#[serde(rename_all = "camelCase")]
pub struct Rules {
    pub root_hash: HashString,
    pub revocation_key: HashString,
    pub prior_revocation_self_sig: Signature, //(empty on Create required on Update)
}

pub fn definitions() -> ValidatingEntryType{
    entry!(
        name: "rules",
        description: "This is the rules that the agent sets for his DeepKey acc",
        sharing: Sharing::Public,
        native_type: Rules,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },

        validation: |_r: Rules, _validation_data: hdk::ValidationData| {
            {
                // **Initial Validation**
                // Check that the origin is from a valid device
                // i.e. the agent is linked from RootHash

                // **On Update**
                // Check if signed by Prior Revocation Key on Update
                // (field not required on Create)
                Ok(())
            }
        },

        links: []
    )
}