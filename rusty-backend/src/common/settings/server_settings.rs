use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct ServerSettings {
    pub port: u16,
}
