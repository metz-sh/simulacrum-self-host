use std::time::Duration;

use sqlx::{pool::PoolOptions, PgPool};
use thiserror::Error;

use crate::Settings;

#[derive(Error, Debug)]
pub enum DbConnectionError {
    #[error("Could not connect to db! `{0:?}`")]
    CouldNotConnect(sqlx::Error),
}

pub type Db = PgPool;
pub fn create_db(settings: &Settings) -> Result<Db, DbConnectionError> {
    PoolOptions::new()
        .max_connections(settings.db.pool.max)
        .min_connections(settings.db.pool.min)
        .acquire_timeout(Duration::from_secs(
            settings.db.pool.acquire_timeout,
        ))
        .connect_lazy(&settings.db.url)
        .map_err(DbConnectionError::CouldNotConnect)
}
