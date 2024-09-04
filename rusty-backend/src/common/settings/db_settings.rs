use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct PoolOptions {
    pub min: u32,
    pub max: u32,
    pub acquire_timeout: u64,
}

#[derive(Debug, Deserialize, Clone)]
pub struct DbSettings {
    pub url: String,
    pub pool: PoolOptions,
}
