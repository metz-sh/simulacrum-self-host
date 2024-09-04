use strum_macros::EnumString;

// This acts as a guard and interface over tables which have entity_id and entity_type but no
//way to validate if the entity_id is indeed belongs to the entity_type.
#[derive(EnumString)]
pub enum EntityId {
    #[strum(to_string="user")]
    User(i32)
}

pub trait Entity {
    fn entity() -> EntityId;
}