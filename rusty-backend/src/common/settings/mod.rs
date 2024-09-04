use std::sync::OnceLock;

use crate::constants::{CONFIG_PATH, TEST_CONFIG_PATH};
use config::{Config, ConfigError};
use serde::Deserialize;
use strum_macros::AsRefStr;

pub mod db_settings;
pub mod server_settings;

#[derive(Debug, Deserialize, Clone, AsRefStr)]
pub enum Environment {
    Local,
    Dev,
    Prod,
}

impl From<&str> for Environment {
    fn from(env: &str) -> Self {
        match env {
            "LOCAL" => Environment::Local,
            "DEV" => Environment::Dev,
            "PROD" => Environment::Prod,
            _ => Environment::Local,
        }
    }
}

#[derive(Debug, Deserialize, Clone)]
pub struct Settings {
    pub frontend_origin: String,
    pub server: server_settings::ServerSettings,
    pub db: db_settings::DbSettings,
    pub env: Environment,
    pub run_migrations: Option<bool>,
}

impl Settings {
    pub fn new() -> Result<Settings, ConfigError> {
        //If this env var is true then a test config will be merged with the main one,
        //overriding if anything clashes
        let load_test_config: bool = std::env::var("LOAD_TEST_CONFIG")
            .map(|var| var.parse().unwrap())
            .unwrap_or(false);

        //Alternate config path
        let config_path: String = std::env::var("CONFIG_PATH")
            .map(|var| var.parse().unwrap())
            .unwrap_or(CONFIG_PATH.to_string());

        //Skip loading from file, rather load from env
        let load_config_from_env: bool = std::env::var("LOAD_CONFIG_FROM_ENV")
            .map(|var| var.parse().unwrap())
            .unwrap_or(false);


        let mut builder = Config::builder()
            .set_default("env", "LOCAL")?;

        builder = match load_config_from_env {
            true => builder.add_source(config::Environment::with_prefix("config").separator("__").prefix_separator("_")),
            false => builder.add_source(config::File::with_name(&config_path))
        };

        if load_test_config {
            println!("Loading test config");
            builder = builder
                .add_source(config::File::with_name(TEST_CONFIG_PATH));
        }
        let settings: Settings = builder
            .add_source(config::Environment::with_prefix("RUN"))
            .build()?
            .try_deserialize()?;
        Ok(settings)
    }
}

pub fn settings() -> &'static Settings {
    static SETTINGS: OnceLock<Settings> = OnceLock::new();
    SETTINGS.get_or_init(|| {
        Settings::new()
            .unwrap_or_else(|err| panic!("Could not load config! {err:?}"))
    })
}
