use thiserror::Error;

use crate::{common::db::{create_db, Db, DbConnectionError}, Settings};
pub mod project_repository;
pub mod project_template_repository;
pub mod embed_repository;
pub mod models;

pub use project_repository::Project;
pub use project_template_repository::ProjectTemplate;
pub use embed_repository::Embed;

#[derive(Error, Debug)]
pub enum RepositoryManagerError {
    #[error("Could not instantiate repository manager! `{0:?}`")]
    InstantiationFailed(#[from] DbConnectionError),
}

#[derive(Clone, Debug)]
pub struct RepositoryManager {
    db: Db,
}

impl RepositoryManager {
    pub async fn new(settings: &Settings) -> Result<Self, RepositoryManagerError> {
        let db = create_db(settings)?;
        Ok(RepositoryManager { db })
    }

    pub fn db(&self) -> &Db {
        &self.db
    }
}

pub type RepositoryError = sqlx::Error;
pub type RepositoryResponse<O> = Result<O, RepositoryError>;

macro_rules! pg {
    () => {
        impl PgExecutor<'_>
    };
}
pub(crate) use pg;
